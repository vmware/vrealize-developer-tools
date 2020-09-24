/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function collectNamespaces(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        const visitor = createVisitor(visitNode, context);

        visitor.visitNode(sourceFile);

        return sourceFile;

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            switch (node.kind) {
                case ts.SyntaxKind.ModuleDeclaration:
                    visitModuleDeclaration(<ts.ModuleDeclaration>node);
                    break;
            }
            return undefined;
        }

        function visitModuleDeclaration(node: ts.ModuleDeclaration): void {
            if (!hasModifier(node.modifiers, ts.SyntaxKind.ExportKeyword)) {
                const name = getPropertyName(node.name);
                if (name) {
                    if (context.globalIdentifiers.indexOf(name) < 0) {
                        context.file.hierarchyFacts |= HierarchyFacts.ContainsGlobalNamespace;
                        context.globalIdentifiers.push(name);
                    }
                }
            }
        }
    }

    export function transformNamespaces(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        if (context.globalIdentifiers.length) {
            const statements = sourceFile.statements.map(node => {
                switch (node.kind) {
                    case ts.SyntaxKind.VariableStatement:
                        return transformNamespaceVariable(node as ts.VariableStatement);
                    case ts.SyntaxKind.ExpressionStatement:
                        return transformExpressionStatement(node as ts.ExpressionStatement);
                }
                return node;
            });

            return ts.updateSourceFileNode(
                sourceFile,
                ts.setTextRange(
                    ts.createNodeArray([
                        ...statements
                    ]),
                    sourceFile.statements));
        }

        return sourceFile;

        function transformNamespaceVariable(node: ts.VariableStatement): ts.VariableStatement {
            if (node.declarationList && node.declarationList.declarations && node.declarationList.declarations.length === 1) {
                const varNode = node.declarationList.declarations[0];
                if (!varNode.initializer) {
                    const varName = getIdentifierTextOrNull(varNode.name);
                    if (varName && context.globalIdentifiers.indexOf(varName) > -1) {
                        return ts.updateVariableStatement(
                            node,
                            node.modifiers,
                            ts.updateVariableDeclarationList(
                                node.declarationList,
                                [
                                    ts.updateVariableDeclaration(
                                        varNode,
                                        varNode.name,
                                        varNode.type,
                                        /* initializer */
                                        ts.createBinary(
                                            /* left */
                                            ts.createPropertyAccess(
                                                /* expression */
                                                ts.createIdentifier(SCRIPT_VRO_GLOBAL),
                                                /* name */
                                                ts.createIdentifier(varName),
                                            ),
                                            /* operator */
                                            ts.createToken(ts.SyntaxKind.BarBarToken),
                                            /* right */
                                            ts.createParen(
                                                ts.createBinary(
                                                    /* left */
                                                    ts.createPropertyAccess(
                                                        /* expression */
                                                        ts.createIdentifier(SCRIPT_VRO_GLOBAL),
                                                        /* name */
                                                        ts.createIdentifier(varName),
                                                    ),
                                                    /* operator */
                                                    ts.createToken(ts.SyntaxKind.FirstAssignment),
                                                    /* right */
                                                    ts.createObjectLiteral([], false),
                                                )
                                            ),
                                        )),
                                ]
                            ));
                    }
                }
            }
            return node;
        }

        function transformExpressionStatement(node: ts.ExpressionStatement): ts.ExpressionStatement {
            if (node.expression.kind === ts.SyntaxKind.CallExpression) {
                const callNode = node.expression as ts.CallExpression;
                if (callNode.arguments.length === 1 && callNode.arguments[0].kind === ts.SyntaxKind.BinaryExpression) {
                    const firstCallArg = callNode.arguments[0] as ts.BinaryExpression;
                    const ns = getIdentifierTextOrNull(firstCallArg.left);
                    if (ns && context.globalIdentifiers.indexOf(ns) > -1) {
                        (callNode.arguments[0] as any) = firstCallArg.left;
                    }
                }
            }
            return node;
        }
    }
}