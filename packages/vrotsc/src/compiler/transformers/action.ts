/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function getActionTransformer(file: FileDescriptor, context: FileTransformationContext) {
        const sourceFile = ts.createSourceFile(file.filePath, system.readFile(file.filePath).toString(), ts.ScriptTarget.Latest, true);
        context.sourceFiles.push(sourceFile);
        return transform;

        function transform() {
            const [sourceText, typeDefText] = transformSourceFile(
                sourceFile,
                context,
                {
                    before: [
                        collectFactsBefore,
                        collectNamespaces,
                        transformShimsBefore,
                    ],
                    after: [
                        collectFactsAfter,
                        transformShims,
                        transformNamespaces,
                    ],
                    afterTransformation: [
                        remediateTypeScript,
                        transformNode,
                        createActionClosure,
                    ]
                });

            const targetFilePath = system.changeFileExt(
                system.resolvePath(context.outputs.actions, file.relativeFilePath),
                ".js",
                [".js", ".ts"]);

            context.writeFile(targetFilePath, sourceText);

            if (canCreateDeclarationForFile(file, context.rootDir)) {
                const targetDtsFilePath = system.changeFileExt(system.resolvePath(context.outputs.types, file.relativeFilePath), ".d.ts");
                context.writeFile(targetDtsFilePath, typeDefText);
            }
        }

        function createActionClosure(sourceFile: ts.SourceFile, ctx: ScriptTransformationContext): ts.SourceFile {
            const statements: ts.Statement[] = [];

            if (ctx.file.hierarchyFacts & HierarchyFacts.ContainsActionClosure) {
                // Copy all statements preceeding the action closure
                const actionClosureIndex = sourceFile.statements.length - 1;
                const expStatement = sourceFile.statements[actionClosureIndex] as ts.ExpressionStatement;
                const parenExpression = expStatement.expression as ts.ParenthesizedExpression;
                const funcExpression = parenExpression.expression as ts.FunctionExpression;
                const funcStatements: ts.Statement[] = [];
                funcStatements.push(...sourceFile.statements.slice(0, actionClosureIndex));
                funcStatements.push(...funcExpression.body.statements);
                if (context.emitHeader) {
                    addHeaderComment(funcStatements);
                }
                const updatedExpStatement = ts.updateExpressionStatement(expStatement,
                    ts.updateParen(parenExpression,
                        ts.updateFunctionExpression(funcExpression,
                            /* modifiers */ undefined,
                            /* asteriskToken */ undefined,
                            /* name */ undefined,
                            /* typeParameters */ undefined,
                            /* parameters */ funcExpression.parameters,
                            /* type */ undefined,
                            /* body */ ts.updateBlock(funcExpression.body, funcStatements),
                        )));
                statements.push(updatedExpStatement);
            }
            else {
                if (context.emitHeader) {
                    addHeaderComment(<ts.Statement[]><unknown>sourceFile.statements);
                }

                // Wrap statements in an action closure
                let closureStatement = ts.createStatement(
                    ts.createParen(
                        ts.createFunctionExpression(
                            /*modifiers*/ undefined,
                            /*asteriskToken*/ undefined,
                            /*name*/ undefined,
                            /*typeParameters*/ undefined,
                            /*parameters*/ undefined,
                            /*modifiers*/ undefined,
                            /*body*/ ts.createBlock(sourceFile.statements, true))));
                closureStatement = ts.addSyntheticLeadingComment(
                    closureStatement,
                    ts.SyntaxKind.MultiLineCommentTrivia,
                    "*\n * @return {Any}\n ",
                    /*hasTrailingNewLine*/ true);
                statements.push(closureStatement);
            }

            return ts.updateSourceFileNode(
                sourceFile,
                ts.setTextRange(
                    ts.createNodeArray(statements),
                    sourceFile.statements));
        }
    }
}
