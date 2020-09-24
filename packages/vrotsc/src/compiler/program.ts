/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function createProgram(options: ProgramOptions): Program {
        const { rootDir, outputs } = options;
        const files = getFiles();
        const fileByPath = files.reduce((obj, f) => {
            obj[f.filePath] = f;
            return obj;
        }, {});

        return {
            getFiles: () => files,
            emit,
        };

        function emit(writeFile: WriteFileCallback): EmitResult {
            const diagnostics = createDiagnosticCollection();
            const emittedFiles: string[] = [];
            const transformerFactoryMap: Record<number, TransformerFactory> = {
                [FileType.Action]: getActionTransformer,
                [FileType.ConfigurationTS]: getConfigTypeScriptTransformer,
                [FileType.ConfigurationYAML]: getConfigYamlTransformer,
                [FileType.TypeDef]: getDeclarationTransformer,
                [FileType.NativeContent]: getNativeContentTransformer,
                [FileType.PolicyTemplate]: getPolicyTemplateTransformer,
                [FileType.Resource]: getResourceTransformer,
                [FileType.JasmineTest]: getTestTransformer,
                [FileType.Workflow]: getWorkflowTransformer,
                [FileType.Saga]: getSagaTransformer,
            };
            const compilerOptions = createCompilerOptions(rootDir, options.project);
            let scriptProgram: ts.Program;
            const context: FileTransformationContext = {
                rootDir: options.rootDir,
                emitHeader: options.emitHeader,
                actionsNamespace: options.actionsNamespace,
                workflowsNamespace: options.workflowsNamespace,
                outputs: outputs,
                diagnostics: diagnostics,
                sourceFiles: [],
                getFile: path => fileByPath[path],
                readFile: fileName => system.readFile(fileName).toString(),
                writeFile: (fileName: string, data: string | Buffer) => {
                    if (data) {
                        writeFile(fileName, data);
                        emittedFiles.push(fileName);
                    }
                },
                getScriptProgram: () => scriptProgram || (scriptProgram = context.sourceFiles.length ?
                    createScriptProgram(context, compilerOptions) : undefined),
            };

            files.map(file => transformerFactoryMap[file.type](file, context)).forEach(transform => transform());

            generateIndexTypes(context);

            if (context.sourceFiles.length) {
                ts.getPreEmitDiagnostics(context.getScriptProgram()).forEach(d => diagnostics.addNative(d));
            }

            return {
                diagnostics: diagnostics.toArray(),
                emittedFiles,
            };
        }

        function createScriptProgram(context: FileTransformationContext, compilerOptions: ts.CompilerOptions): ts.Program {
            const sourceFileByPath: Record<string, ts.SourceFile> = context.sourceFiles.reduce((obj, sourceFile) => {
                obj[sourceFile.fileName] = sourceFile;
                return obj;
            }, {});

            const sourceFileCache: Record<string, ts.SourceFile> = {};
            const defaultLibLocation = system.normalizePath(system.joinPath(system.getExecutingDirPath(), "..", "lib"));
            const defaultLibFileName = system.joinPath(defaultLibLocation, "lib.d.ts");

            const compilerHost: ts.CompilerHost = {
                getSourceFile: (fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void, shouldCreateNewSourceFile?: boolean) => {
                    let sourceFile = sourceFileByPath[fileName];
                    if (!sourceFile) {
                        if (shouldCreateNewSourceFile || !sourceFileCache[fileName]) {
                            sourceFileCache[fileName] = ts.createSourceFile(
                                fileName,
                                system.readFile(fileName).toString(),
                                languageVersion !== undefined ? languageVersion : ts.ScriptTarget.Latest,
                                true);
                        }
                        sourceFile = sourceFileCache[fileName];
                    }
                    return sourceFile;
                },
                writeFile: noop,
                getDefaultLibFileName: () => defaultLibFileName,
                getDefaultLibLocation: () => defaultLibLocation,
                useCaseSensitiveFileNames: () => false,
                getCanonicalFileName: fileName => fileName,
                getCurrentDirectory: () => system.getCurrentDirectory(),
                getNewLine: () => "\n",
                fileExists: fileName => system.fileExists(fileName),
                readFile: fileName => system.readFile(fileName).toString(),
                directoryExists: directoryName => system.directoryExists(directoryName),
                getDirectories: path => system.getDirectories(path),
            };

            const program = ts.createProgram({
                rootNames: context.sourceFiles.map(f => f.fileName),
                options: compilerOptions,
                host: compilerHost,
            });

            return program;
        }

        function getFiles(): FileDescriptor[] {
            let filePaths = system.getFiles(rootDir, true);
            const fileSet: Record<string, boolean> = {};
            const files: FileDescriptor[] = [];

            // eslint-disable-next-line no-return-assign
            filePaths.forEach(filePath => fileSet[filePath.toLowerCase()] = true);

            if (options.files && options.files.length) {
                filePaths = options.files.map(fileName => system.resolvePath(rootDir, fileName))
                    .filter(filePath => fileSet[filePath.toLowerCase()]);
            }

            filePaths.forEach(filePath => {
                const fileType = getFileType(filePath, fileSet);
                if (fileType !== undefined) {
                    const fileName = system.basename(filePath);
                    const relativeFilePath = system.relativePath(rootDir, filePath);
                    const relativeDirPath = system.dirname(relativeFilePath);
                    files.push({
                        filePath: filePath,
                        fileName: fileName,
                        relativeFilePath: relativeFilePath,
                        relativeDirPath: relativeDirPath === "." ? "" : relativeDirPath,
                        type: fileType,
                    });
                }
            });

            return files;
        }

        function getFileType(filePath: string, fileSet: Record<string, boolean>): FileType {
            filePath = filePath.toLowerCase();

            if (filePath.endsWith(".wf.ts")) {
                return FileType.Workflow;
            }

            if (filePath.endsWith(".conf.ts")) {
                return FileType.ConfigurationTS;
            }

            if (filePath.endsWith(".pl.ts")) {
                return FileType.PolicyTemplate;
            }

            if (filePath.endsWith(".d.ts")) {
                return FileType.TypeDef;
            }

            if (filePath.endsWith(".test.ts") || filePath.endsWith(".test.js")) {
                return FileType.JasmineTest;
            }

            if (filePath.endsWith(".ts") || filePath.endsWith(".js")) {
                return FileType.Action;
            }

            if (filePath.endsWith(".conf.yaml")) {
                return FileType.ConfigurationYAML;
            }

            if (filePath.endsWith(".saga.yaml")) {
                return FileType.Saga;
            }

            if (filePath.endsWith(".xml") && fileSet[`${system.changeFileExt(filePath, "")}.element_info.xml`]) {
                return FileType.NativeContent;
            }

            if (!filePath.endsWith(".element_info.xml") &&
                !filePath.endsWith(".element_info.yaml") &&
                !filePath.endsWith(".element_info.json") &&
                !filePath.endsWith(".wf.xml") &&
                !filePath.endsWith(".pl.xml") &&
                !filePath.endsWith(".saga.xml")) {
                return FileType.Resource;
            }
        }
    }
}
