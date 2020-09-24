/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function createCompilerOptions(rootDir: string, projectPath?: string): ts.CompilerOptions {
        if (projectPath) {
            const tsconfigText = system.readFile(projectPath).toString();
            const parsed = ts.parseConfigFileTextToJson(projectPath, tsconfigText);
            const parseHost = createParseConfigHost();
            const basePath = system.dirname(system.resolvePath(projectPath));
            const parsedCommandLine = ts.parseJsonConfigFileContent(parsed.config, parseHost, basePath);
            return parsedCommandLine.options;
        }
        
            return {
                module: ts.ModuleKind.CommonJS,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                target: ts.ScriptTarget.ES5,
                lib: [
                    "lib.es5.d.ts",
                    "lib.es2015.core.d.ts",
                    "lib.es2015.collection.d.ts",
                    "lib.es2015.iterable.d.ts",
                    "lib.es2015.promise.d.ts",
                    "lib.es2017.string.d.ts"
                ],
                strict: false,
                allowUnreachableCode: true,
                noImplicitUseStrict: true,
                stripInternal: false,
                removeComments: false,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                suppressOutputPathCheck: true,
                rootDir: rootDir,
                baseUrl: rootDir,
                allowJs: true,
                declaration: true,
            };
        
    }

    function createParseConfigHost(): ts.ParseConfigHost {
        return {
            useCaseSensitiveFileNames: false,
            fileExists: (fileName: string): boolean => {
                return system.fileExists(fileName);
            },
            readFile: (path: string): string => {
                return system.readFile(path).toString();
            },
            readDirectory: (path: string, extensions: string[], excludes: string[], includes: string[], depth: number): string[] => {
                return system.getFiles(path, false);
            }
        }
    }
}