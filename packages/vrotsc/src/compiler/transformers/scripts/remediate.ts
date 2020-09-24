/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    const TSLibExports =
        [
            "__extends",
            "__assign",
            "__decorate",
            "__param",
            "__metadata",
            "__awaiter",
            "__generator"
        ].reduce((state, val) => {
            state[val] = true;
            return state;
        }, {});

    export function remediateTypeScript(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        let changed = false;
        const statements: ts.Statement[] = [];
        copyArray(statements, sourceFile.statements);

        changed = removeUnderscoreUnderscoreESModule(statements) || changed;
        changed = useTSLib(statements) || changed;

        if (changed) {
            sourceFile = ts.updateSourceFileNode(
                sourceFile,
                ts.setTextRange(
                    ts.createNodeArray(statements),
                    sourceFile.statements));
        }

        return sourceFile;

        // Remove a statement generated by the TypeScript transformers. 
        // This statement is used only with esModuleInterop=true which we don't use. (Node and ES6 import interop is handled by VROES.require).
        // Statement: Object.defineProperty(exports, "__esModule", { value: true });
        function removeUnderscoreUnderscoreESModule(statements: ts.Statement[]): boolean {
            const index = statements.findIndex(statement => isUnderscoreUnderscoreESModule(statement));
            if (index > -1) {
                statements.splice(index, 1);
                return true;
            }
        }

        function isUnderscoreUnderscoreESModule(node: ts.Node): boolean {
            if (node.kind !== ts.SyntaxKind.ExpressionStatement) {
                return false;
            }

            const { expression } = node as ts.ExpressionStatement;

            if (expression.kind !== ts.SyntaxKind.CallExpression) {
                return false;
            }

            const callExp = expression as ts.CallExpression;

            if (callExp.arguments.length !== 3) {
                return false;
            }

            if (callExp.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return false;
            }

            const propAccessExp = callExp.expression as ts.PropertyAccessExpression;

            if (!isIdentifier(propAccessExp.expression, "Object")) {
                return false;
            }

            if (!isIdentifier(propAccessExp.name, "defineProperty")) {
                return false;
            }

            if (!isIdentifier(callExp.arguments[0], "exports")) {
                return false;
            }

            if (!isStringLiteral(callExp.arguments[1], "__esModule")) {
                return false;
            }

            if (callExp.arguments[2].kind !== ts.SyntaxKind.ObjectLiteralExpression) {
                return false;
            }

            return true;
        }

        function useTSLib(statements: ts.Statement[]): boolean {
            let changed = false;
            statements.forEach((statement, index) => {
                const varName = getTSLibVariable(statement);
                if (varName) {
                    statements[index] = ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList([
                            ts.createVariableDeclaration(
                                varName,
                                /* type */ undefined,
                                ts.createPropertyAccess(ts.createPropertyAccess(ts.createIdentifier("VROES"), "tslib"), varName)
                            )
                        ])
                    );
                    context.file.hierarchyFacts |= HierarchyFacts.ContainsVroesReference;
                    changed = true;
                }
            });

            return changed;
        }

        function getTSLibVariable(node: ts.Statement): string {
            if (node.kind !== ts.SyntaxKind.VariableStatement) {
                return null;
            }

            const { declarationList } = node as ts.VariableStatement;
            if (declarationList.declarations.length !== 1) {
                return null;
            }

            const { name } = declarationList.declarations[0];
            if (name.kind !== ts.SyntaxKind.Identifier) {
                return null;
            }

            const nameText = (name as ts.Identifier).text;
            if (TSLibExports[nameText]) {
                return nameText;
            }
        }
    }
}