/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");
    const yaml: typeof import("js-yaml") = require("js-yaml");

    interface ConfigurationDescriptor {
        id: string;
        version: string;
        name: string;
        path: string;
        attributes: Record<string, string | ConfigurationAttribute>;
    }

    interface ConfigurationAttribute {
        type: string;
        value?: any;
        description?: string;
    }

    export function getConfigTypeScriptTransformer(file: FileDescriptor, context: FileTransformationContext) {
        return transform;

        function transform() {
            const sourceFile = ts.createSourceFile(file.filePath, system.readFile(file.filePath).toString(), ts.ScriptTarget.Latest, true);
            sourceFile.statements.filter(n => n.kind === ts.SyntaxKind.ClassDeclaration).forEach(classNode => {
                transformConfigClass(classNode as ts.ClassDeclaration);
            });
        }

        function transformConfigClass(classNode: ts.ClassDeclaration): void {
            const configInfo: ConfigurationDescriptor = {
                id: undefined,
                path: undefined,
                version: "1.0.0",
                name: classNode.name.text,
                attributes: {}
            };

            if (classNode.decorators && classNode.decorators.length) {
                buildConfigDecorators(configInfo, classNode);
            }

            classNode.members
                .filter(m => m.kind === ts.SyntaxKind.PropertyDeclaration)
                .forEach((fieldNode: ts.PropertyDeclaration) => {
                    buildConfigAttribute(configInfo, fieldNode);
                });

            configInfo.name = configInfo.name || classNode.name.text;
            configInfo.path = configInfo.path || system.joinPath(context.workflowsNamespace || "", system.dirname(file.relativeFilePath));
            configInfo.id = configInfo.id || generateElementId(FileType.ConfigurationTS, `${configInfo.path}/${configInfo.name}`);

            const targetFilePath = system.changeFileExt(
                system.resolvePath(context.outputs.configs, configInfo.path, configInfo.name),
                "",
                [".conf.ts"]);

            context.writeFile(`${targetFilePath}.xml`, printConfigXml(configInfo));
            context.writeFile(`${targetFilePath}.element_info.xml`, printElementInfo({
                categoryPath: configInfo.path.replace(/(\\|\/)/g, "."),
                name: configInfo.name,
                type: "ConfigurationElement",
                id: configInfo.id,
            }));
        }

        function buildConfigAttribute(configInfo: ConfigurationDescriptor, fieldNode: ts.PropertyDeclaration): void {
            const attName = getPropertyName(fieldNode.name);
            let configAtt = configInfo.attributes[attName] as ConfigurationAttribute;
            if (!configAtt) {
                configAtt = {
                    type: "Any"
                };
                if (fieldNode.initializer) {
                    switch (fieldNode.initializer.kind) {
                        case ts.SyntaxKind.StringLiteral:
                            configAtt.type = "string";
                            configAtt.value = (<ts.StringLiteral>(fieldNode.initializer)).text;
                            break;
                        case ts.SyntaxKind.NumericLiteral:
                            configAtt.type = "number";
                            configAtt.value = parseInt((<ts.NumericLiteral>fieldNode.initializer).text);
                            break;
                        case ts.SyntaxKind.TrueKeyword:
                            configAtt.type = "boolean";
                            configAtt.value = true;
                            break;
                        case ts.SyntaxKind.FalseKeyword:
                            configAtt.type = "boolean";
                            configAtt.value = false;
                            break;
                    }
                }
                if (fieldNode.type) {
                    configAtt.type = getVroType(fieldNode.type);
                }

                configInfo.attributes[attName] = configAtt;
            }
        }

        function buildConfigDecorators(configInfo: ConfigurationDescriptor, classNode: ts.ClassDeclaration): void {
            classNode.decorators
                .filter(decoratorNode => {
                    const callExpNode = decoratorNode.expression as ts.CallExpression;
                    if (callExpNode && callExpNode.expression.kind === ts.SyntaxKind.Identifier) {
                        return (<ts.Identifier>callExpNode.expression).text === "Configuration";
                    }
                })
                .forEach(decoratorNode => {
                    buildConfigDecorator(configInfo, <ts.CallExpression>decoratorNode.expression);
                });
        }

        function buildConfigDecorator(configInfo: ConfigurationDescriptor, decoratorCallExp: ts.CallExpression): void {
            const objLiteralNode = decoratorCallExp.arguments[0] as ts.ObjectLiteralExpression;
            if (objLiteralNode) {
                objLiteralNode.properties.forEach((property: ts.PropertyAssignment) => {
                    const propName = getPropertyName(property.name);
                    switch (propName) {
                        case "id":
                            configInfo.id = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "name":
                            configInfo.name = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "path":
                            configInfo.path = (<ts.StringLiteral>property.initializer).text;
                            break;
                        case "version":
                            configInfo.version = (<ts.StringLiteral>(property.initializer)).text;
                            break;
                        case "attributes":
                            buildConfigAttributes(configInfo, <ts.ObjectLiteralExpression>property.initializer);
                            break;
                        default:
                            throw new Error(`Configuration attribute '${propName}' is not suported.`);
                    }
                });
            }
        }

        function buildConfigAttributes(configInfo: ConfigurationDescriptor, objLiteralNode: ts.ObjectLiteralExpression): void {
            objLiteralNode.properties.forEach((property: ts.PropertyAssignment) => {
                const name = getPropertyName(property.name);
                let attrInfo : ConfigurationAttribute = {type: "Any", value: null, description: null};
                switch (property.initializer.kind) {
                    case ts.SyntaxKind.StringLiteral:
                        const type : string = (<ts.StringLiteral>property.initializer).text;
                        attrInfo.type = type;
                        break;
                    case ts.SyntaxKind.ObjectLiteralExpression:
                        attrInfo = getAttrInfo(property.initializer as ts.ObjectLiteralExpression);
                        break;
                };
                const configAtt = configInfo.attributes[name] as ConfigurationAttribute;
                if (configAtt) {
                    configAtt.type = attrInfo.type != null ? attrInfo.type : configAtt.type;
                    configAtt.value = attrInfo.value != null ? attrInfo.value : configAtt.value;
                    configAtt.description = attrInfo.description != null ? attrInfo.description : configAtt.description;
                }
                else {
                    configInfo.attributes[name] = attrInfo;
                }
            });
        }

        function getAttrInfo(exp : ts.ObjectLiteralExpression) : ConfigurationAttribute {
            const result : ConfigurationAttribute = {type: "Any", value: null, description: null};
            exp.properties.forEach((property: ts.PropertyAssignment) => {
                const name = getPropertyName(property.name);
                if (name == "type") {
                    result.type = (<ts.StringLiteral>property.initializer).text;
                } else if (name == "value") {
                    result.value = getValue(property.initializer);
                } else if (name == "description") {
                    result.description = (<ts.StringLiteral>property.initializer).text;
                }
            });
            return result;
        }

        function getValue(literal: ts.Expression) {
            if (literal) {
                switch (literal.kind) {
                    case ts.SyntaxKind.StringLiteral:
                        return (<ts.StringLiteral>(literal)).text;
                    case ts.SyntaxKind.NumericLiteral:
                        return parseInt((<ts.NumericLiteral>literal).text);
                    case ts.SyntaxKind.TrueKeyword:
                        return true;
                    case ts.SyntaxKind.FalseKeyword:
                        return false;
                    default:
                        return null;
                }
            }
        }
    }

    export function getConfigYamlTransformer(file: FileDescriptor, context: FileTransformationContext) {
        return transform;

        function transform() {
            const configInfo: ConfigurationDescriptor = yaml.safeLoad(system.readFile(file.filePath).toString());
            configInfo.name = configInfo.name || system.changeFileExt(file.fileName, "");
            configInfo.path = configInfo.path || system.joinPath(context.workflowsNamespace || "", system.dirname(file.relativeFilePath));
            configInfo.id = configInfo.id || generateElementId(FileType.ConfigurationYAML, `${configInfo.path}/${configInfo.name}`);
            configInfo.version = configInfo.version || "1.0.0";
            configInfo.attributes = configInfo.attributes || {};

            const outFilePath = system.changeFileExt(
                system.resolvePath(context.outputs.configs, configInfo.path, configInfo.name),
                "",
                [".conf.yaml"]);

            context.writeFile(`${outFilePath}.xml`, printConfigXml(configInfo));
            context.writeFile(`${outFilePath}.element_info.xml`, printElementInfo({
                categoryPath: configInfo.path.replace(/(\\|\/)/g, "."),
                name: configInfo.name,
                type: "ConfigurationElement",
                id: configInfo.id,
            }));
        }
    }

    function printConfigXml(config: ConfigurationDescriptor): string {
        const stringBuilder = createStringBuilder("", "");
        stringBuilder.append(`<?xml version="1.0" encoding="utf-8" ?>`).appendLine();
        stringBuilder.append(`<config-element id="${config.id}" version="${config.version}">`).appendLine();
        stringBuilder.indent();
        stringBuilder.append(`<display-name><![CDATA[${config.name}]]></display-name>`).appendLine();
        stringBuilder.append(`<atts>`).appendLine();
        stringBuilder.indent();

        if (config.attributes) {
            Object.keys(config.attributes).forEach(attName => {
                const attOrType = config.attributes[attName];
                const att: ConfigurationAttribute = typeof attOrType === "string" ? { type: attOrType } : attOrType;
                stringBuilder.append(`<att name="${attName}" type="${att.type}" read-only="false"`);
                if (att.value != null || att.description != null) {
                    stringBuilder.append(`>`).appendLine();
                    stringBuilder.indent();
                    if (att.value != null) {
                        stringBuilder.append(`<value encoded="n"><![CDATA[${att.value}]]></value>`).appendLine();
                    }
                    if (att.description != null) {
                        stringBuilder.append(`<description><![CDATA[${att.description}]]></description>`).appendLine();
                    }
                    stringBuilder.unindent();
                    stringBuilder.append(`</att>`).appendLine();
                }
                else {
                    stringBuilder.append(` />`).appendLine();
                }
            });
        }

        stringBuilder.unindent();
        stringBuilder.append(`</atts>`).appendLine();
        stringBuilder.unindent();
        stringBuilder.append(`</config-element>`).appendLine();
        return stringBuilder.toString();
    }
}
