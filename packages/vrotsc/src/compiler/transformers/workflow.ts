/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");
    const xmldoc: typeof import("xmldoc") = require("xmldoc");

    interface WorkflowDescriptor {
        id: string;
        name: string;
        path: string;
        version: string;
        presentation: string;
        parameters: WorkflowParameter[];
        items: WorkflowItemDescriptor[];
    }

    interface WorkflowItemDescriptor {
        name: string;
        input: string[];
        output: string[];
        sourceText: string;
    }

    interface WorkflowParameter {
        name: string;
        type: string;
        title?: string;
        required?: boolean;
        multiLine?: boolean;
        hidden?: boolean;
        maxStringLength?: number;
        minStringLength?: number;
        numberFormat?: string;
        defaultValue?: string;
        availableValues?: string[];
        parameterType: WorkflowParameterType;
        isAttribute?: boolean;
    }

    enum WorkflowParameterType {
        Default = 0,
        Input = 1 << 0,
        Output = 2 << 1,
    }

    export function getWorkflowTransformer(file: FileDescriptor, context: FileTransformationContext) {
        const sourceFile = ts.createSourceFile(file.filePath, system.readFile(file.filePath).toString(), ts.ScriptTarget.Latest, true);
        const workflows: WorkflowDescriptor[] = [];
        const actionSourceFiles: ts.SourceFile[] = [];

        sourceFile.statements.filter(n => n.kind === ts.SyntaxKind.ClassDeclaration).forEach(classNode => {
            registerWorkflowClass(classNode as ts.ClassDeclaration);
        });
        actionSourceFiles.forEach(sf => context.sourceFiles.push(sf));

        return transform;

        function transform() {
            transpileActionItems();

            workflows.forEach(workflowInfo => {
                const targetFilePath = system.changeFileExt(
                    system.resolvePath(context.outputs.workflows, workflowInfo.path, workflowInfo.name),
                    "",
                    [".wf.ts"]);

                const xmlTemplateFilePath = system.changeFileExt(file.filePath, ".xml");
                const xmlTemplate = system.fileExists(xmlTemplateFilePath) ? system.readFile(xmlTemplateFilePath).toString() : undefined;

                context.writeFile(`${targetFilePath}.xml`, xmlTemplate ? mergeWorkflowXml(workflowInfo, xmlTemplate) : printWorkflowXml(workflowInfo));
                context.writeFile(`${targetFilePath}.element_info.xml`, printElementInfo({
                    categoryPath: workflowInfo.path.replace(/(\\|\/)/g, "."),
                    name: workflowInfo.name,
                    type: "Workflow",
                    id: workflowInfo.id,
                }));
            });
        }

        function transpileActionItems(): void {
            const actionItems = workflows.reduce((items, wf) => items.concat(wf.items), <WorkflowItemDescriptor[]>[]);
            actionSourceFiles.forEach((actionSourceFile, i) => {
                const [sourceText] = transformSourceFile(
                    actionSourceFile,
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
                actionItems[i].sourceText = sourceText;
            });
        }

        function emitHeaderComment(sourceFile: ts.SourceFile): ts.SourceFile {
            if (context.emitHeader) {
                addHeaderComment(<ts.Statement[]><unknown>sourceFile.statements);
            }
            return sourceFile;
        }

        function registerWorkflowClass(classNode: ts.ClassDeclaration): void {
            const workflowInfo: WorkflowDescriptor = {
                id: undefined,
                name: classNode.name.text,
                path: undefined,
                version: "1.0.0",
                parameters: [],
                items: [],
                presentation: undefined,
            };

            if (classNode.decorators && classNode.decorators.length) {
                buildWorkflowDecorators(workflowInfo, classNode);
            }

            classNode.members
                .filter(member => member.kind === ts.SyntaxKind.MethodDeclaration)
                .forEach((methodNode: ts.MethodDeclaration) => {
                    registerWorkflowItem(workflowInfo, methodNode);
                });

            workflowInfo.name = workflowInfo.name || classNode.name.text;
            workflowInfo.path = workflowInfo.path || system.joinPath(context.workflowsNamespace || "", system.dirname(file.relativeFilePath));
            workflowInfo.id = workflowInfo.id || generateElementId(FileType.Workflow, `${workflowInfo.path}/${workflowInfo.name}`);
            workflows.push(workflowInfo);
        }

        function registerWorkflowItem(workflowInfo: WorkflowDescriptor, methodNode: ts.MethodDeclaration): void {
            const itemInfo: WorkflowItemDescriptor = {
                name: getPropertyName(methodNode.name),
                input: [],
                output: [],
                sourceText: "",
            };

            if (methodNode.parameters.length) {
                methodNode.parameters.forEach(paramNode => {
                    const name = getIdentifierTextOrNull(paramNode.name);
                    if (name) {
                        let parameterType = WorkflowParameterType.Default;
                        getDecoratorNames(paramNode.decorators).forEach(decoratorName => {
                            switch (decoratorName || "In") {
                                case "In":
                                    parameterType |= WorkflowParameterType.Input;
                                    break;
                                case "Out":
                                    parameterType |= WorkflowParameterType.Output;
                                    break;
                                default:
                                    throw new Error(`Decorator '${decoratorName} is not supported'`);
                            }
                        });

                        if (parameterType === WorkflowParameterType.Default) {
                            parameterType = WorkflowParameterType.Input;
                        }

                        if (parameterType & WorkflowParameterType.Input) {
                            itemInfo.input.push(name);
                        }

                        if (parameterType & WorkflowParameterType.Output) {
                            itemInfo.output.push(name);
                        }

                        buildWorkflowParameter(workflowInfo, paramNode, parameterType);
                    }
                });
            }

            const actionSourceFilePath = system.changeFileExt(sourceFile.fileName, `.${itemInfo.name}.wf.ts`, [".wf.ts"]);
            const actionSourceText = printSourceFile(
                ts.updateSourceFileNode(
                    sourceFile,
                    [
                        ...sourceFile.statements.filter(n => n.kind !== ts.SyntaxKind.ClassDeclaration),
                        ...createWorkflowItemPrologueStatements(methodNode),
                        ...methodNode.body.statements
                    ]));
            const actionSourceFile = ts.createSourceFile(
                actionSourceFilePath,
                actionSourceText,
                ts.ScriptTarget.Latest,
                true);

            actionSourceFiles.push(actionSourceFile);
            workflowInfo.items.push(itemInfo);
        }

        function createWorkflowItemPrologueStatements(methodNode: ts.MethodDeclaration): ts.Statement[] {
            const statements: ts.Statement[] = [];

            if (methodNode.parameters.length) {
                const variableDeclarations: ts.VariableDeclaration[] = [];
                methodNode.parameters.forEach(paramNode => {
                    const paramName = (<ts.Identifier>paramNode.name).text;
                    variableDeclarations.push(ts.createVariableDeclaration(
                        paramName,
                        paramNode.type,
                        /* initializer */ undefined
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

        function buildWorkflowParameter(workflowInfo: WorkflowDescriptor, paramNode: ts.ParameterDeclaration, parameterType: WorkflowParameterType): void {
            const name = (<ts.Identifier>paramNode.name).text;
            let parameter = workflowInfo.parameters.find(p => p.name === name);
            if (!parameter) {
                parameter = {
                    name: name,
                    type: getVroType(paramNode.type),
                    parameterType: WorkflowParameterType.Default,
                    required: !paramNode.questionToken
                };
                workflowInfo.parameters.push(parameter);
            }

            parameter.parameterType |= parameterType;

            if (parameter.type == null) {
                parameter.type = getVroType(paramNode.type);
            }
        }

        function buildWorkflowDecorators(workflowInfo: WorkflowDescriptor, classNode: ts.ClassDeclaration): void {
            classNode.decorators
                .filter(decoratorNode => {
                    const callExpNode = decoratorNode.expression as ts.CallExpression;
                    if (callExpNode && callExpNode.expression.kind === ts.SyntaxKind.Identifier) {
                        return (<ts.Identifier>callExpNode.expression).text === "Workflow";
                    }
                })
                .forEach(decoratorNode => {
                    buildWorkflowDecorator(workflowInfo, <ts.CallExpression>decoratorNode.expression);
                });
        }

        function buildWorkflowDecorator(workflowInfo: WorkflowDescriptor, decoratorCallExp: ts.CallExpression): void {
            const objLiteralNode = decoratorCallExp.arguments[0] as ts.ObjectLiteralExpression;
            if (objLiteralNode) {
                objLiteralNode.properties.forEach((property: ts.PropertyAssignment) => {
                    const propName = getPropertyName(property.name);
                    switch (propName) {
                        case "id":
                            workflowInfo.id = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "name":
                            workflowInfo.name = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "path":
                            workflowInfo.path = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "version":
                            workflowInfo.version = (<ts.StringLiteral>(property.initializer)).text;
                            break;
                        case "presentation":
                            workflowInfo.presentation = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "input":
                            buildWorkflowDecoratorParameters(workflowInfo.parameters, <ts.ObjectLiteralExpression>property.initializer, WorkflowParameterType.Input);
                            break;
                        case "output":
                            buildWorkflowDecoratorParameters(workflowInfo.parameters, <ts.ObjectLiteralExpression>property.initializer, WorkflowParameterType.Output);
                            break;
                        case "attributes":
                            buildWorkflowDecoratorParameters(workflowInfo.parameters, <ts.ObjectLiteralExpression>property.initializer, WorkflowParameterType.Default, true);
                            break;
                        default:
                            throw new Error(`Workflow attribute '${propName}' is not suported.`);
                    }
                });
            }
        }

        function buildWorkflowDecoratorParameters(parameters: WorkflowParameter[], objLiteralNode: ts.ObjectLiteralExpression,
            parameterType: WorkflowParameterType, isAttribute?: boolean): void {
            objLiteralNode.properties.forEach((property: ts.PropertyAssignment) => {
                const name = getPropertyName(property.name);
                const objectLiteralNode = <ts.ObjectLiteralExpression>property.initializer;
                if (objectLiteralNode) {
                    const parameter = <WorkflowParameter>{
                        name: name,
                        parameterType: parameterType,
                        isAttribute: isAttribute,
                    };

                    objectLiteralNode.properties.forEach((property: ts.PropertyAssignment) => {
                        const propName = getPropertyName(property.name);
                        switch (propName) {
                            case "type":
                                parameter.type = (<ts.StringLiteral>property.initializer).text;
                                break;
                            case "title":
                                parameter.title = (<ts.StringLiteral>property.initializer).text;
                                break;
                            case "required":
                                parameter.required = property.initializer.kind === ts.SyntaxKind.TrueKeyword;
                                break;
                            case "multiLine":
                                parameter.multiLine = property.initializer.kind === ts.SyntaxKind.TrueKeyword;
                                break;
                            case "hidden":
                                parameter.hidden = property.initializer.kind === ts.SyntaxKind.TrueKeyword;
                                break;
                            case "maxStringLength":
                                parameter.maxStringLength = parseInt((<ts.NumericLiteral>property.initializer).text);
                                break;
                            case "minStringLength":
                                parameter.minStringLength = parseInt((<ts.NumericLiteral>property.initializer).text);
                                break;
                            case "numberFormat":
                                parameter.numberFormat = (<ts.StringLiteral>property.initializer).text;
                                break;
                            case "defaultValue":
                                parameter.defaultValue = getWorkflowParamValue(property.initializer);
                                if (parameter.defaultValue === undefined) {
                                    context.diagnostics.addAtNode(
                                        sourceFile,
                                        property.initializer,
                                        `Workflow parameter default value should be of type string, number or boolean.`,
                                        DiagnosticCategory.Error);
                                }
                                break;
                            case "availableValues":
                                parameter.availableValues = (<ts.ArrayLiteralExpression>property.initializer).elements.map(getWorkflowParamValue);
                                if (parameter.availableValues.some(v => v === undefined)) {
                                    context.diagnostics.addAtNode(
                                        sourceFile,
                                        property.initializer,
                                        `Workflow parameter available values should be of type string, number or boolean.`,
                                        DiagnosticCategory.Error);
                                    parameter.availableValues = undefined;
                                }
                                break;
                            default:
                                throw new Error(`Workflow parameter attribute '${propName}' is not suported.`);
                        }
                    });

                    parameters.push(parameter);
                }
            });
        }

        function getWorkflowParamValue(node: ts.Node): string {
            switch (node.kind) {
                case ts.SyntaxKind.StringLiteral:
                    return (<ts.StringLiteral>node).text;
                case ts.SyntaxKind.NumericLiteral:
                    {
                        let value = (<ts.NumericLiteral>node).text;
                        if (value.indexOf(".") < 0) {
                            value += ".0";
                        }
                        return value;
                    }
                case ts.SyntaxKind.TrueKeyword:
                    return "true";
                case ts.SyntaxKind.FalseKeyword:
                    return "false";
            }
        }

        function mergeWorkflowXml(workflow: WorkflowDescriptor, xmlTemplate: string): string {
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
                        stringBuilder.append(` ${attName}="${workflow.id}"`);
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
                    stringBuilder.append(`<![CDATA[${workflow.items[scriptIndex++].sourceText}]]>`);
                }
                else if (ele.name === "display-name" && xmlLevel === 1) {
                    stringBuilder.append(`<![CDATA[${workflow.name}]]>`);
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

        function printWorkflowXml(workflow: WorkflowDescriptor): string {
            const stringBuilder = createStringBuilder("", "");
            stringBuilder.append(`<?xml version="1.0" encoding="utf-8" ?>`).appendLine();
            stringBuilder.append(`<workflow`
                + ` xmlns="http://vmware.com/vco/workflow"`
                + ` xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`
                + ` xsi:schemaLocation="http://vmware.com/vco/workflow http://vmware.com/vco/workflow/Workflow-v4.xsd"`
                + ` root-name="item1"`
                + ` object-name="workflow:name=generic"`
                + ` id="${workflow.id}"`
                + ` version="${workflow.version}"`
                + ` api-version="6.0.0"`
                + ` restartMode="1"`
                + ` resumeFromFailedMode="0"`
                + `>`).appendLine();
            stringBuilder.indent();
            stringBuilder.append(`<display-name><![CDATA[${workflow.name}]]></display-name>`).appendLine();
            stringBuilder.append(`<position x="105" y="45.90909090909091" />`).appendLine();
            buildParameters("input", workflow.parameters.filter(p => !p.isAttribute && p.parameterType & WorkflowParameterType.Input));
            buildParameters("output", workflow.parameters.filter(p => !p.isAttribute && p.parameterType & WorkflowParameterType.Output));
            buildAttributes(workflow.parameters.filter(p => p.isAttribute));
            buildEndItem();
            workflow.items.forEach((item, i) => buildItem(item, i + 1));
            buildPresentation();
            stringBuilder.unindent();
            stringBuilder.append(`</workflow>`).appendLine();
            return stringBuilder.toString();

            function buildParameters(parentName: string, parameters: WorkflowParameter[]): void {
                if (parameters.length) {
                    stringBuilder.append(`<${parentName}>`).appendLine();
                    stringBuilder.indent();
                    parameters.forEach(param => {
                        stringBuilder.append(`<param name="${param.name}" type="${param.type}" />`).appendLine();
                    });
                    stringBuilder.unindent();
                    stringBuilder.append(`</${parentName}>`).appendLine();
                }
            }

            function buildAttributes(attributes: WorkflowParameter[]): void {
                attributes.forEach(att => {
                    stringBuilder.append(`<attrib name="${att.name}" type="${att.type}" read-only="false" />`).appendLine();
                });
            }

            function buildEndItem() {
                stringBuilder.append(`<workflow-item name="item0" type="end" end-mode="0">`).appendLine();
                stringBuilder.indent();
                stringBuilder.append(`<position x="${265 + 160 * workflow.items.length}.0" y="45.40909090909091" />`).appendLine();
                stringBuilder.unindent();
                stringBuilder.append(`</workflow-item>`).appendLine();
            }

            function buildItem(item: WorkflowItemDescriptor, pos: number): void {
                stringBuilder.append(`<workflow-item`
                    + ` name="item${pos}"`
                    + ` out-name="${pos < workflow.items.length ? `item${pos + 1}` : "item0"}"`
                    + ` type="task"`
                    + ">").appendLine();
                stringBuilder.indent();
                stringBuilder.append(`<display-name><![CDATA[${item.name}]]></display-name>`).appendLine();
                stringBuilder.append(`<script encoded="false"><![CDATA[${item.sourceText}]]></script>`).appendLine();
                buildItemParameterBindings("in-binding", item.input);
                buildItemParameterBindings("out-binding", item.output);
                stringBuilder.append(`<position x="${225 + 160 * (pos - 1)}.0" y="55.40909090909091" />`).appendLine();
                stringBuilder.unindent();
                stringBuilder.append(`</workflow-item>`).appendLine();
            }

            function buildItemParameterBindings(parentName: string, parameters: string[]): void {
                if (parameters.length) {
                    stringBuilder.append(`<${parentName}>`).appendLine();
                    stringBuilder.indent();
                    parameters.forEach(paramName => {
                        const param = workflow.parameters.find(p => p.name === paramName);
                        if (param) {
                            stringBuilder.append(`<bind name="${param.name}" type="${param.type}" export-name="${param.name}" />`).appendLine();
                        }
                    });
                    stringBuilder.unindent();
                    stringBuilder.append(`</${parentName}>`).appendLine();
                }
            }

            function buildPresentation(): void {
                if (workflow.presentation) {
                    stringBuilder.append(workflow.presentation);
                }
                else {
                    const inputParameters = workflow.parameters.filter(p => p.parameterType === WorkflowParameterType.Input);
                    if (inputParameters.length) {
                        stringBuilder.append(`<presentation>`).appendLine();
                        stringBuilder.indent();

                        inputParameters.forEach(param => {
                            stringBuilder.append(`<p-param name="${param.name}">`).appendLine();
                            stringBuilder.indent();
                            stringBuilder.append(`<desc><![CDATA[${param.title || param.name}]]></desc>`).appendLine();

                            if (param.required) {
                                stringBuilder.append(`<p-qual kind="static" name="mandatory" type="boolean"><![CDATA[true]]></p-qual>`).appendLine();
                            }

                            if (param.multiLine) {
                                stringBuilder.append(`<p-qual kind="static" name="textInput" type="void" />`).appendLine();
                            }

                            if (param.minStringLength != null) {
                                stringBuilder.append(`<p-qual kind="static" name="minStringLength" type="Number"><![CDATA[${param.minStringLength.toString()}]]></p-qual>`).appendLine();
                            }

                            if (param.maxStringLength != null) {
                                stringBuilder.append(`<p-qual kind="static" name="maxStringLength" type="Number"><![CDATA[${param.maxStringLength.toString()}]]></p-qual>`).appendLine();
                            }

                            if (param.numberFormat != null) {
                                stringBuilder.append(`<p-qual kind="static" name="numberFormat" type="String"><![CDATA[${param.numberFormat}]]></p-qual>`).appendLine();
                            }

                            if (param.defaultValue != null) {
                                stringBuilder.append(`<p-qual kind="static" name="defaultValue" type="${param.type}"><![CDATA[${param.defaultValue}]]></p-qual>`).appendLine();
                            }

                            if (param.availableValues != null && param.availableValues.length) {
                                const availableValuesToken = `#{${param.availableValues.map(v => `#${param.type}#${v}#`).join(";")}}#`;
                                stringBuilder.append(`<p-qual kind="static" name="genericEnumeration" type="Array/${param.type}"><![CDATA[${availableValuesToken}]]></p-qual>`).appendLine();
                            }

                            stringBuilder.unindent();
                            stringBuilder.append(`</p-param>`).appendLine();
                        });

                        stringBuilder.unindent();
                        stringBuilder.append(`</presentation>`).appendLine();
                    }
                }
            }
        }
    }
}
