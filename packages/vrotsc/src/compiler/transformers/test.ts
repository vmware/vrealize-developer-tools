/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function getTestTransformer(file: FileDescriptor, context: FileTransformationContext) {
        const sourceFile = ts.createSourceFile(file.filePath, system.readFile(file.filePath).toString(), ts.ScriptTarget.Latest, true);
        context.sourceFiles.push(sourceFile);
        return transform;

        function transform() {
            const [sourceFileText] = transformSourceFile(
                sourceFile,
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
                        remediateTestClosure,
                    ]
                });

            let targetFilePath = system.changeFileExt(
                system.resolvePath(context.outputs.tests, file.relativeFilePath),
                "",
                [".test.js", ".test.ts"]);

            if (!targetFilePath.endsWith("Test")) {
                targetFilePath += "Test";
            }

            targetFilePath += ".js";

            context.writeFile(targetFilePath, sourceFileText);
        }

        function remediateTestClosure(sourceFile: ts.SourceFile): ts.SourceFile {
            const statements: ts.Statement[] = [];
            const describeStatementIndex = sourceFile.statements.findIndex(isDescribeCall);
            if (describeStatementIndex > - 1) {
                // Copy all statements before and after the describe closure
                const describeStatement = sourceFile.statements[describeStatementIndex] as ts.ExpressionStatement;
                const describeCallExpression = describeStatement.expression as ts.CallExpression;
                const funcExpression = describeCallExpression.arguments[1] as ts.FunctionExpression;
                const funcStatements: ts.Statement[] = [];
                funcStatements.push(...sourceFile.statements.slice(0, describeStatementIndex));
                funcStatements.push(...(<ts.Block>funcExpression.body).statements);
                funcStatements.push(...sourceFile.statements.slice(describeStatementIndex + 1));

                const updatedExpStatement = ts.updateExpressionStatement(describeStatement,
                    ts.updateCall(describeCallExpression,
                        describeCallExpression.expression,
                        /* typeArguments */ undefined,
                        [
                            describeCallExpression.arguments[0],
                            ts.updateFunctionExpression(funcExpression,
                                /* modifiers */ undefined,
                                /* asteriskToken */ undefined,
                                /* name */ undefined,
                                /* typeParameters */ undefined,
                                /* parameters */ funcExpression.parameters,
                                /* type */ undefined,
                                /* body */ ts.updateBlock(funcExpression.body, funcStatements),
                            )
                        ]));

                statements.push(updatedExpStatement);
            }
            else {
                context.diagnostics.add({
                    file: system.relativePath(system.getCurrentDirectory(), sourceFile.fileName),
                    messageText: `Jasmine test file should have describe function`,
                    category: DiagnosticCategory.Error,
                });
            }

            return ts.updateSourceFileNode(
                sourceFile,
                ts.setTextRange(
                    ts.createNodeArray(statements),
                    sourceFile.statements));
        }

        function isDescribeCall(statement: ts.Statement): boolean {
            if (statement.kind !== ts.SyntaxKind.ExpressionStatement) {
                return false;
            }

            const { expression } = statement as ts.ExpressionStatement;

            if (expression.kind !== ts.SyntaxKind.CallExpression) {
                return false;
            }

            const { expression: callExp, arguments: callArgs } = expression as ts.CallExpression;

            if (!isIdentifier(callExp, "describe")) {
                return false;
            }

            if (callArgs.length !== 2) {
                return false;
            }

            if (callArgs[0].kind !== ts.SyntaxKind.StringLiteral) {
                return false;
            }

            if (callArgs[1].kind !== ts.SyntaxKind.ArrowFunction && callArgs[1].kind !== ts.SyntaxKind.FunctionExpression) {
                return false;
            }

            return true;
        }
    }
}
