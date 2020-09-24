/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const xmldoc: typeof import("xmldoc") = require("xmldoc");

    export function getNativeContentTransformer(file: FileDescriptor, context: FileTransformationContext) {
        return transform;

        function transform() {
            const content = system.readFile(file.filePath);
            const elementInfoContent = getXmlElementInfo();
            if (elementInfoContent) {
                const xmlDoc = new xmldoc.XmlDocument(elementInfoContent);
                const categoryPath = xmlDoc.childWithAttribute("key", "categoryPath").val.replace(/\./g, system.pathSeparator);
                const elementType = xmlDoc.childWithAttribute("key", "type").val;
                const baseTargetPath = getBaseTargetPath(elementType);
                const targetFilePath = system.resolvePath(baseTargetPath, categoryPath, file.fileName);
                context.writeFile(targetFilePath, content);
                context.writeFile(`${targetFilePath}.element_info.xml`, elementInfoContent);
            }
        }

        function getXmlElementInfo(): string {
            let elementInfoFilePath = `${file.filePath}.element_info.xml`;
            if (system.fileExists(elementInfoFilePath)) {
                return system.readFile(elementInfoFilePath).toString();
            }

            elementInfoFilePath = system.changeFileExt(file.filePath, ".element_info.xml");
            if (system.fileExists(elementInfoFilePath)) {
                return system.readFile(elementInfoFilePath).toString();
            }

            context.diagnostics.add({
                file: system.relativePath(system.getCurrentDirectory(), file.filePath),
                messageText: `File ${file.relativeFilePath} does not have element_info.xml file associated with it.`,
                category: DiagnosticCategory.Error,
            });
        }

        function getBaseTargetPath(elementType: string): string {
            switch (elementType) {
                case "Workflow":
                    return context.outputs.workflows;
                case "ConfigurationElement":
                    return context.outputs.configs;
                case "PolicyTemplate":
                    return context.outputs.policyTemplates;
                default:
                    throw new Error(`Element type '${elementType}' is not supported.`);
            }
        }
    }
}
