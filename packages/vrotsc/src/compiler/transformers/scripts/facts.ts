/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function collectFactsBefore(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        const visitor = createVisitor(visitNode, context);
        const actionClosureIndex = sourceFile.statements.findIndex(isActionClosure);

        if (actionClosureIndex > -1 && actionClosureIndex === sourceFile.statements.length - 1) {
            context.file.hierarchyFacts |= HierarchyFacts.ContainsActionClosure;
        }

        visitor.visitNode(sourceFile);

        return sourceFile;

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            switch (node.kind) {
                case ts.SyntaxKind.Identifier:
                    visitIdentifier(<ts.Identifier>node);
                    break;

                case ts.SyntaxKind.ExportKeyword:
                case ts.SyntaxKind.ExportDeclaration:
                case ts.SyntaxKind.ExportAssignment:
                case ts.SyntaxKind.ExportSpecifier:
                    context.file.hierarchyFacts |= HierarchyFacts.ContainsEcmaScriptExport;
                    break;
            }
            return undefined;
        }

        function visitIdentifier(node: ts.Identifier): void {
            if (node.text === SCRIPT_VROES_VAR) {
                context.file.hierarchyFacts |= HierarchyFacts.ContainsVroesReference;
            }
        }
    }

    export function collectFactsAfter(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        const visitor = createVisitor(visitNode, context);

        visitor.visitNode(sourceFile);

        return sourceFile;

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            switch (node.kind) {
                case ts.SyntaxKind.CallExpression:
                    visitCallExpression(<ts.CallExpression>node);
                    break;
            }
            return undefined;
        }

        function visitCallExpression(node: ts.CallExpression): void {
            if (isRequireCall(node)) {
                context.file.hierarchyFacts |= HierarchyFacts.ContainsRequire;
            }
        }
    }
}