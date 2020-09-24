/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export function createVisitor(callback: ts.Visitor, context: ts.TransformationContext): Visitor {
        const nodeHeritage: ts.Node[] = [];

        return {
            visitNode,
            visitNodes,
            visitEachChild,
            getParent,
            hasParents,
        };

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            nodeHeritage.push(node);
            try {
                const result = callback(node);
                if (result !== undefined) {
                    return result;
                }
                return ts.visitEachChild(node, visitNode, context);
            }
            finally {
                nodeHeritage.pop();
            }
        }

        function visitNodes<T extends ts.Node>(nodes: ts.NodeArray<T> | undefined): ts.NodeArray<T> {
            return ts.visitNodes(nodes, visitNode);
        }

        function visitEachChild<T extends ts.Node>(node: T): T {
            return ts.visitEachChild(node, visitNode, context);
        }

        function getParent(index?: number): ts.Node {
            return nodeHeritage[nodeHeritage.length - 2 - (index || 0)];
        }

        function hasParents(...kinds: ts.SyntaxKind[]): boolean {
            for (let i = 0; i < kinds.length; i++) {
                const parentNode = nodeHeritage[nodeHeritage.length - 2 + i];
                if (!parentNode || parentNode.kind !== kinds[i]) {
                    return false;
                }
            }
            return true;
        }
    }
}