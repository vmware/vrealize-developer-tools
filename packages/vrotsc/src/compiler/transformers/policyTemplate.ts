/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");
    const xmldoc: typeof import("xmldoc") = require("xmldoc");

    interface PolicyTemplateDescriptor {
        id: string;
        name: string;
        description?: string;
        path: string;
        tag: string;
        type: string;
        version: string;
        schedule?: PolicyTemplateScheduleDescriptor;
        events: PolicyTemplateEventDescriptor[];
    }

    interface PolicyTemplateScheduleDescriptor {
        periode: string;
        when: string;
        timezone: string;
    }

    interface PolicyTemplateEventDescriptor {
        type: string;
        sourceText: string;
    }

    export function getPolicyTemplateTransformer(file: FileDescriptor, context: FileTransformationContext) {
        const sourceFile = ts.createSourceFile(file.filePath, system.readFile(file.filePath).toString(), ts.ScriptTarget.Latest, true);
        const policyTemplates: PolicyTemplateDescriptor[] = [];
        const eventSourceFiles: ts.SourceFile[] = [];

        sourceFile.statements.filter(n => n.kind === ts.SyntaxKind.ClassDeclaration).forEach(classNode => {
            registerPolicyTemplateClass(classNode as ts.ClassDeclaration);
        });
        eventSourceFiles.forEach(sf => context.sourceFiles.push(sf));

        return transform;

        function transform() {
            transpilePolicyEvents();

            policyTemplates.forEach(policyTemplateInfo => {
                const targetFilePath = system.changeFileExt(
                    system.resolvePath(context.outputs.policyTemplates, policyTemplateInfo.path, policyTemplateInfo.name),
                    "",
                    [".pl.ts"]);

                const xmlTemplateFilePath = system.changeFileExt(file.filePath, ".xml");
                const xmlTemplate = system.fileExists(xmlTemplateFilePath) ? system.readFile(xmlTemplateFilePath).toString() : undefined;

                context.writeFile(`${targetFilePath}.xml`, xmlTemplate ? mergePolicyTemplateXml(policyTemplateInfo, xmlTemplate) : printPolicyTemplateXml(policyTemplateInfo));
                context.writeFile(`${targetFilePath}.element_info.xml`, printElementInfo({
                    categoryPath: policyTemplateInfo.path.replace(/(\\|\/)/g, "."),
                    name: policyTemplateInfo.name,
                    type: "PolicyTemplate",
                    id: policyTemplateInfo.id,
                }));
            });
        }

        function transpilePolicyEvents(): void {
            const events = policyTemplates.reduce((events, pl) => events.concat(pl.events), <PolicyTemplateEventDescriptor[]>[]);
            eventSourceFiles.forEach((eventSourceFile, i) => {
                const [sourceText] = transformSourceFile(
                    eventSourceFile,
                    context,
                    {
                        before: [
                            collectFactsBefore,
                            transformShimsBefore,
                        ],
                        after: [
                            collectFactsAfter,
                            transformShims,
                        ],
                        afterTransformation: [
                            remediateTypeScript,
                            transformNode,
                            emitHeaderComment,
                        ]
                    },
                    file);
                events[i].sourceText = sourceText;
            });
        }

        function emitHeaderComment(sourceFile: ts.SourceFile): ts.SourceFile {
            if (context.emitHeader) {
                addHeaderComment(<ts.Statement[]><unknown>sourceFile.statements);
            }
            return sourceFile;
        }

        function registerPolicyTemplateClass(classNode: ts.ClassDeclaration): void {
            const policyTemplateInfo: PolicyTemplateDescriptor = {
                id: undefined,
                name: classNode.name.text,
                path: undefined,
                tag: undefined,
                type: "AMQP:Subscription",
                version: "1.0.0",
                events: [],
            };

            if (classNode.decorators && classNode.decorators.length) {
                buildPolicyTemplateDecorators(policyTemplateInfo, classNode);
            }

            classNode.members
                .filter(member => member.kind === ts.SyntaxKind.MethodDeclaration)
                .forEach((methodNode: ts.MethodDeclaration) => {
                    registerPolicyTemplateItem(policyTemplateInfo, methodNode);
                });

            policyTemplateInfo.name = policyTemplateInfo.name || classNode.name.text;
            policyTemplateInfo.path = policyTemplateInfo.path || system.joinPath(context.workflowsNamespace || "", system.dirname(file.relativeFilePath));
            policyTemplateInfo.id = policyTemplateInfo.id || generateElementId(FileType.PolicyTemplate, `${policyTemplateInfo.path}/${policyTemplateInfo.name}`);

            policyTemplates.push(policyTemplateInfo);
        }

        function registerPolicyTemplateItem(policyTemplateInfo: PolicyTemplateDescriptor, methodNode: ts.MethodDeclaration): void {
            const eventInfo: PolicyTemplateEventDescriptor = {
                type: getEventType(methodNode),
                sourceText: undefined,
            };

            const eventSourceFilePath = system.changeFileExt(sourceFile.fileName, `.${eventInfo.type}.pl.ts`, [".pl.ts"]);
            const eventSourceText = printSourceFile(
                ts.updateSourceFileNode(
                    sourceFile,
                    [
                        ...sourceFile.statements.filter(n => n.kind !== ts.SyntaxKind.ClassDeclaration),
                        ...createPolicyTemplateItemPrologueStatements(methodNode),
                        ...methodNode.body.statements
                    ]));
            const eventSourceFile = ts.createSourceFile(
                eventSourceFilePath,
                eventSourceText,
                ts.ScriptTarget.Latest,
                true);

            policyTemplateInfo.events.push(eventInfo);
            eventSourceFiles.push(eventSourceFile);
        }

        function getEventType(methodNode: ts.MethodDeclaration): string {
            const eventType = getPropertyName(methodNode.name);
            switch (eventType.toLowerCase()) {
                case "oninit":
                    return "OnInit"
                case "onexit":
                    return "OnExit";
                case "onexecute":
                    return "OnExecute";
                case "onmessage":
                    return "OnMessage";
                case "ontrap":
                    return "OnTrap";
                case "ontrapall":
                    return "OnTrapAll";
                default:
                    throw new Error(`PolicyTemplate event type '${eventType}' is not supported.`);
            }
        }

        function createPolicyTemplateItemPrologueStatements(methodNode: ts.MethodDeclaration): ts.Statement[] {
            const statements: ts.Statement[] = [];

            if (methodNode.parameters.length) {
                const variableDeclarations: ts.VariableDeclaration[] = [];
                methodNode.parameters.forEach(paramNode => {
                    const paramName = (<ts.Identifier>paramNode.name).text;
                    variableDeclarations.push(ts.createVariableDeclaration(
                        paramName,
                        paramNode.type,
                        /*initializer*/ undefined
                    ));
                });

                if (variableDeclarations.length) {
                    statements.push(ts.createVariableStatement(
                        [ts.createModifier(ts.SyntaxKind.DeclareKeyword)],
                        variableDeclarations));
                }
            }

            return statements;
        }

        function buildPolicyTemplateDecorators(policyTemplateInfo: PolicyTemplateDescriptor, classNode: ts.ClassDeclaration): void {
            classNode.decorators
                .filter(decoratorNode => {
                    const callExpNode = decoratorNode.expression as ts.CallExpression;
                    if (callExpNode && callExpNode.expression.kind === ts.SyntaxKind.Identifier) {
                        return (<ts.Identifier>callExpNode.expression).text === "PolicyTemplate";
                    }
                })
                .forEach(decoratorNode => {
                    buildPolicyTemplateDecorator(policyTemplateInfo, <ts.CallExpression>decoratorNode.expression);
                });
        }

        function buildPolicyTemplateDecorator(policyTemplateInfo: PolicyTemplateDescriptor, decoratorCallExp: ts.CallExpression): void {
            const objLiteralNode = decoratorCallExp.arguments[0] as ts.ObjectLiteralExpression;
            if (objLiteralNode) {
                objLiteralNode.properties.forEach((property: ts.PropertyAssignment) => {
                    const propName = getPropertyName(property.name);
                    switch (propName) {
                        case "id":
                            policyTemplateInfo.id = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "name":
                            policyTemplateInfo.name = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "description":
                            policyTemplateInfo.description = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "path":
                            policyTemplateInfo.path = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "type":
                            policyTemplateInfo.type = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "version":
                            policyTemplateInfo.version = (<ts.StringLiteral>(property.initializer)).text;
                            break;
                        case "schedule":
                            policyTemplateInfo.schedule = {
                                periode: undefined,
                                when: undefined,
                                timezone: undefined,
                            };
                            (<ts.ObjectLiteralExpression>property.initializer).properties
                                .filter((property: ts.PropertyAssignment) => !!property.initializer && ts.isStringLiteral(property.initializer))
                                .forEach((property: ts.PropertyAssignment) => {
                                    policyTemplateInfo.schedule[getPropertyName(property.name)] = (<ts.StringLiteral>(property.initializer)).text;
                                });
                            break;
                        default:
                            throw new Error(`PolicyTemplate attribute '${propName}' is not suported.`);
                    }
                });
            }
        }

        function mergePolicyTemplateXml(policyTemplate: PolicyTemplateDescriptor, xmlTemplate: string): string {
            const xmlDoc = new xmldoc.XmlDocument(xmlTemplate);
            const stringBuilder = createStringBuilder();
            let scriptIndex = 0;
            let xmlLevel = 0;

            stringBuilder.append(`<?xml version="1.0" encoding="UTF-8"?>`).appendLine();
            mergeNode(xmlDoc);

            return stringBuilder.toString();

            function mergeNode(node: XmlNode): void {
                switch (node.type) {
                    case "element":
                        mergeElement(<XmlElement>node);
                        break;
                    case "text":
                    case "cdata":
                        stringBuilder.append(node.toString().trim());
                        break;
                }
            }

            function mergeElement(ele: XmlElement): void {
                stringBuilder.append(`<${ele.name}`);
                for (const attName in ele.attr || {}) {
                    if (xmlLevel === 0 && attName === "id") {
                        stringBuilder.append(` ${attName}="${policyTemplate.id}"`);
                    }
                    else {
                        stringBuilder.append(` ${attName}="${ele.attr[attName]}"`);
                    }
                }
                stringBuilder.append(">");
                mergeChildren(ele);
                stringBuilder.append(`</${ele.name}>`);
            }

            function mergeChildren(ele: XmlElement): void {
                if (ele.name === "script") {
                    stringBuilder.append(`<![CDATA[${policyTemplate.events[scriptIndex++].sourceText}]]>`);
                }
                else if (ele.name === "description" && xmlLevel === 1 && policyTemplate.description != null) {
                    stringBuilder.append(`<![CDATA[${policyTemplate.description}]]>`);
                }
                else if (ele.children && ele.children.length) {
                    xmlLevel++;
                    (ele.children || []).forEach(childNode => {
                        mergeNode(childNode);
                    });
                    xmlLevel--;
                }
                else if (ele.val != null) {
                    stringBuilder.append(ele.val);
                }
            }
        }

        function printPolicyTemplateXml(policyTemplate: PolicyTemplateDescriptor): string {
            const stringBuilder = createStringBuilder("", "");
            stringBuilder.append(`<?xml version="1.0" encoding="utf-8" ?>`).appendLine();
            stringBuilder.append(`<dunes-policy`
                + ` name="${policyTemplate.name}"`
                + ` id="${policyTemplate.id}"`
                + ` version="${policyTemplate.version}"`
                + ` api-version="6.0.0"`
                + ` type="0"`
                + ` allowed-operations="vef"`
                + `>`).appendLine();
            stringBuilder.indent();
            if (policyTemplate.description) {
                stringBuilder.append(`<description><![CDATA[${policyTemplate.description}]]></description>`).appendLine();
            }
            if (policyTemplate.schedule) {
                buildScheduledItem(policyTemplate.schedule);
            }
            else {
                printSdkItem(policyTemplate.type || "AMQP:Subscription");
            }
            stringBuilder.unindent();
            stringBuilder.append(`</dunes-policy>`).appendLine();
            return stringBuilder.toString();

            function buildScheduledItem(schedule: PolicyTemplateScheduleDescriptor): void {
                stringBuilder.append(`<item`
                    + ` tag="Schedule"`
                    + ` type="0"`
                    + ` periode="${schedule.periode}"`
                    + ` when="${schedule.when}"`
                    + ` timezone="${schedule.timezone}"`
                    + `>`).appendLine();
                stringBuilder.indent();
                printEvents(policyTemplate.events);
                stringBuilder.unindent();
                stringBuilder.append(`</item>`).appendLine();
            }

            function printSdkItem(sdkType: string): void {
                stringBuilder.append(`<item`
                    + ` tag="${sdkType.replace(":", " ")}"`
                    + ` type="0"`
                    + ` sdkType="${sdkType}"`
                    + `>`).appendLine();
                stringBuilder.indent();
                printEvents(policyTemplate.events);
                stringBuilder.unindent();
                stringBuilder.append(`</item>`).appendLine();
            }

            function printEvents(events: PolicyTemplateEventDescriptor[]): void {
                events.forEach(event => {
                    stringBuilder.append(`<event type="${event.type}" kind="trigger" active="false">`).appendLine();
                    stringBuilder.indent();
                    stringBuilder.append(`<script encoded="false"><![CDATA[${event.sourceText}]]></script>`).appendLine();
                    stringBuilder.unindent();
                    stringBuilder.append(`</event>`).appendLine();
                });
            }
        }
    }
}
