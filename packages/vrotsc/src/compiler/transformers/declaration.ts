/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");
    const isKeyword: (name: string) => boolean = require("is-keyword-js");

    export function getDeclarationTransformer(file: FileDescriptor, context: FileTransformationContext) {
        return transform;

        function transform() {
            const content = system.readFile(file.filePath);
            const targetDtsFilePath = system.resolvePath(context.outputs.types, file.relativeFilePath);
            context.writeFile(targetDtsFilePath, content);
        }
    }

    export function generateIndexTypes(context: FileTransformationContext): void {
        if (system.directoryExists(context.outputs.types)) {
            generateIndexTypesForPath(context.outputs.types);
        }

        function generateIndexTypesForPath(path: string): boolean {
            if (system.fileExists(system.joinPath(path, "index.d.ts"))) {
                return true;
            }
            const relativeDirPath = system.relativePath(context.outputs.types, path);
            const importFiles: string[] = [];
            const importGlobalFiles: string[] = [];
            const importFolders: string[] = [];

            system.getFiles(path).forEach(filePath => {
                const fileName = system.basename(filePath);
                if (fileName.toLowerCase().endsWith(".d.ts")) {
                    const importName = system.changeFileExt(fileName, "", [".d.ts"]);
                    const sourceFilePath = system.joinPath(context.rootDir, relativeDirPath, `${importName}.ts`);
                    const file = context.getFile(sourceFilePath) as ScriptFileDescriptor;
                    if (file) {
                        if (file.hierarchyFacts & HierarchyFacts.ContainsGlobalNamespace) {
                            importGlobalFiles.push(importName);    
                        }
                        else {
                            importFiles.push(importName);
                        }
                    }
                }
            });

            system.getDirectories(path).forEach(dirName => {
                if (generateIndexTypesForPath(system.joinPath(path, dirName))) {
                    importFolders.push(dirName);
                }
            });

            if (importFiles.length || importGlobalFiles.length || importFolders.length) {
                const dtsContent = printIndexTypes(importFiles, importGlobalFiles, importFolders);
                const dtsFilePath = system.resolvePath(path, "index.d.ts");
                context.writeFile(dtsFilePath, dtsContent);
                return true;
            }

            return false;
        }

        function printIndexTypes(importFiles: string[], importGlobalFiles: string[], importFolders: string[]): string {
            const stringBuilder = createStringBuilder();
            const exportNames: string[] = [];

            importGlobalFiles.forEach(name => {
                stringBuilder.append(`import "./${name}";`).appendLine();
            });

            importFiles.forEach(name => {
                const safeName = getSafeExportName(name);
                exportNames.push(safeName);
                stringBuilder.append(`import * as ${safeName} from "./${name}";`).appendLine();
            });

            importFolders.forEach(name => {
                const safeName = getSafeExportName(name);
                exportNames.push(safeName);
                stringBuilder.append(`import * as ${safeName} from "./${name}/index";`).appendLine();
            });

            if (exportNames.length) {
                stringBuilder.append(`export { ${exportNames.join(", ")} };`).appendLine();
            }

            return stringBuilder.toString();
        }

        function getSafeExportName(name: string): string {
            let safeName = name.replace(/[^\$\_\w]/g, "");
            safeName = isNaN(parseInt(`${ safeName.charAt(0)}`)) && !isKeyword(safeName) ? safeName : (`_${ safeName}`);
            return safeName;
        }
    }

    export function canCreateDeclarationForFile(file: FileDescriptor, rootDir: string): boolean {
        if (!file.fileName.toLowerCase().endsWith(".ts")) {
            return false;
        }

        if (system.fileExists(system.changeFileExt(file.filePath, ".d.ts"))) {
            return false;
        }

        let stop = false;
        let relativeDirPath = file.relativeDirPath;
        do {
            const dirPath = relativeDirPath ? system.joinPath(rootDir, relativeDirPath) : rootDir;
            if (system.fileExists(system.joinPath(dirPath, "index.d.ts"))) {
                return false;
            }

            if (relativeDirPath) {
                relativeDirPath = relativeDirPath.indexOf(system.pathSeparator) > -1 ? system.dirname(relativeDirPath) : undefined;
            }
            else {
                stop = true;
            }
        }
        while (!stop);

        return true;
    }
}
