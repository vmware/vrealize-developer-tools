/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    const ShimReferences: Record<string, ShimReference> = {
        "Map": {
            typeName: "MapConstructor",
            facts: HierarchyFacts.ContainsMap,
        },
        "WeakMap": {
            typeName: "WeakMapConstructor",
            facts: HierarchyFacts.ContainsWeakMap,
        },
        "Set": {
            typeName: "SetConstructor",
            facts: HierarchyFacts.ContainsSet,
        },
        "WeakSet": {
            typeName: "WeakSetConstructor",
            facts: HierarchyFacts.ContainsWeakSet,
        },
        "Promise": {
            typeName: "PromiseConstructor",
            facts: HierarchyFacts.ContainsPromise,
        },
    };

    interface ShimReference {
        typeName: string;
        facts: HierarchyFacts;
    }

    export function transformShims(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        const visitor = createVisitor(visitNode, context);

        return visitSourceFile(sourceFile);

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            switch (node.kind) {
                case ts.SyntaxKind.CallExpression:
                    return visitCallExpression(<ts.CallExpression>node);

                case ts.SyntaxKind.Identifier:
                    return visitIdentifier(<ts.Identifier>node);
            }
        }

        function visitSourceFile(node: ts.SourceFile): ts.SourceFile {
            const statements = visitor.visitNodes(node.statements);
            const prologue = createPrologueStatements();

            return ts.updateSourceFileNode(
                node,
                ts.setTextRange(
                    ts.createNodeArray([
                        ...prologue,
                        ...statements,
                    ]),
                    node.statements));
        }

        function visitCallExpression(node: ts.CallExpression): ts.Expression {
            const symbol = context.typeChecker.getSymbolAtLocation(node.expression);
            if (symbol) {
                switch (context.typeChecker.getFullyQualifiedName(symbol)) {
                    case "String.startsWith":
                        return shimInstanceCall("stringStartsWith", node);
                    case "String.endsWith":
                        return shimInstanceCall("stringEndsWith", node);
                    case "String.includes":
                        return shimInstanceCall("stringIncludes", node);
                    case "String.repeat":
                        return shimInstanceCall("stringRepeat", node);
                    case "String.padStart":
                        return shimInstanceCall("stringPadStart", node);
                    case "String.padEnd":
                        return shimInstanceCall("stringPadEnd", node);
                    case "Array.find":
                        return shimInstanceCall("arrayFind", node);
                    case "Array.findIndex":
                        return shimInstanceCall("arrayFindIndex", node);
                    case "Array.fill":
                        return shimInstanceCall("arrayFill", node);
                    case "ArrayConstructor.from":
                        return shimStaticCall("arrayFrom", node);
                    case "ArrayConstructor.of":
                        return shimStaticCall("arrayOf", node);
                    case "ObjectConstructor.assign":
                        return shimStaticCall("objectAssign", node);
                }
            }

            return visitor.visitEachChild(node);
        }

        function visitIdentifier(node: ts.Identifier): ts.Identifier {
            const shimRef = ShimReferences[node.text];
            if (shimRef) {
                const symbol = context.typeChecker.getSymbolAtLocation(node);
                if (symbol && symbol.valueDeclaration && symbol.valueDeclaration.kind === ts.SyntaxKind.VariableDeclaration) {
                    const symbolVarDecl = symbol.valueDeclaration as ts.VariableDeclaration;
                    if (symbolVarDecl.type && symbolVarDecl.type.kind === ts.SyntaxKind.TypeReference) {
                        const typeRef = symbolVarDecl.type as ts.TypeReferenceNode;
                        if (getIdentifierTextOrNull(typeRef.typeName) === shimRef.typeName) {
                            context.file.hierarchyFacts |= shimRef.facts;
                        }
                    }
                }
            }

            return visitor.visitEachChild(node);
        }

        function shimInstanceCall(methodName: string, node: ts.CallExpression): ts.CallExpression {
            if (node.expression.kind !== ts.SyntaxKind.PropertyAccessExpression) {
                return visitor.visitEachChild(node);
            }

            context.file.hierarchyFacts |= HierarchyFacts.ContainsPolyfills;

            const args: ts.Expression[] = [];
            args.push((<ts.PropertyAccessExpression>node.expression).expression);
            node.arguments.forEach(n => args.push(n));

            return ts.createCall(
                ts.createPropertyAccess(
                    ts.createPropertyAccess(
                        ts.createIdentifier("VROES"),
                        "Shims"),
                    methodName),
                undefined,
                visitor.visitNodes(ts.createNodeArray(args, false)));
        }

        function shimStaticCall(methodName: string, node: ts.CallExpression): ts.CallExpression {
            context.file.hierarchyFacts |= HierarchyFacts.ContainsPolyfills;

            return ts.createCall(
                ts.createPropertyAccess(
                    ts.createPropertyAccess(
                        ts.createIdentifier("VROES"),
                        "Shims"),
                    methodName),
                undefined,
                visitor.visitNodes(node.arguments));
        }

        function createPrologueStatements(): ts.Statement[] {
            const statements: ts.Statement[] = [];
            const variableDeclarations: ts.VariableDeclaration[] = [];

            if (context.file.hierarchyFacts & HierarchyFacts.ContainsMap) {
                // var Map = VROES.Map
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "Map",
                        /*type*/ undefined,
                        ts.createPropertyAccess(
                            ts.createIdentifier(SCRIPT_VROES_VAR),
                            "Map"
                        )
                    ));
            }

            if (context.file.hierarchyFacts & HierarchyFacts.ContainsWeakMap) {
                // var WeakMap = VROES.Map
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "WeakMap",
                        /*type*/ undefined,
                        ts.createPropertyAccess(
                            ts.createIdentifier(SCRIPT_VROES_VAR),
                            "Map"
                        )
                    ));
            }

            if (context.file.hierarchyFacts & HierarchyFacts.ContainsSet) {
                // var Set = VROES.Set
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "Set",
                        /*type*/ undefined,
                        ts.createPropertyAccess(
                            ts.createIdentifier(SCRIPT_VROES_VAR),
                            "Set"
                        )
                    ));
            }

            if (context.file.hierarchyFacts & HierarchyFacts.ContainsWeakSet) {
                // var WeakSet = VROES.Set
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "WeakSet",
                        /*type*/ undefined,
                        ts.createPropertyAccess(
                            ts.createIdentifier(SCRIPT_VROES_VAR),
                            "Set"
                        )
                    ));
            }

            if (context.file.hierarchyFacts & HierarchyFacts.ContainsPromise) {
                // var Promise = VROES.Promise
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "Promise",
                        /*type*/ undefined,
                        ts.createPropertyAccess(
                            ts.createIdentifier(SCRIPT_VROES_VAR),
                            "Promise"
                        )
                    ));
            }

            if (variableDeclarations.length) {
                statements.push(ts.createVariableStatement(/*modifiers*/ undefined, variableDeclarations));
            }

            return statements;
        }
    }

    export function transformShimsBefore(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        const visitor = createVisitor(visitNode, context);

        return visitSourceFile(sourceFile);

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            switch (node.kind) {
                case ts.SyntaxKind.ArrayLiteralExpression:
                    return visitArrayLiteralExpression(<ts.ArrayLiteralExpression>node);
                case ts.SyntaxKind.ObjectLiteralExpression:
                    return visitObjectLiteralExpression(<ts.ObjectLiteralExpression>node);
            }
        }

        function visitSourceFile(node: ts.SourceFile): ts.SourceFile {
            const statements = visitor.visitNodes(node.statements);

            return ts.updateSourceFileNode(
                node,
                ts.setTextRange(
                    ts.createNodeArray([
                        ...statements,
                    ]),
                    node.statements));
        }

        function visitArrayLiteralExpression(node: ts.ArrayLiteralExpression): ts.Node {
            const hasSpreadElement = node.elements.some(e => e.kind === ts.SyntaxKind.SpreadElement);
            if (hasSpreadElement) {
                context.file.hierarchyFacts |= HierarchyFacts.ContainsSpreadArray;
                return transformhasSpreadElement(node);
            }
            return node;
        }

        function visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): ts.Node {
            const hasSpreadAssignment = node.properties.some(e => e.kind === ts.SyntaxKind.SpreadAssignment);
            if (hasSpreadAssignment) {
                context.file.hierarchyFacts |= HierarchyFacts.ContainsSpreadOperator;
                return transformSpreadAssignment(node);
            }
            return node;
        }

        function transformhasSpreadElement(node: ts.ArrayLiteralExpression): ts.Node {
            const arrays: ts.Expression[] = [];
            let currentElems: ts.Expression[] = [];

            const addCurrentProps = () => {
                if (currentElems.length) {
                    arrays.push(ts.createArrayLiteral(currentElems));
                    currentElems = [];
                }
            };

            for (const elem of node.elements) {
                if (elem.kind === ts.SyntaxKind.SpreadElement) {
                    addCurrentProps();
                    arrays.push((<ts.SpreadElement>elem).expression);
                }
                else {
                    currentElems.push(elem);
                }
            }

            addCurrentProps();

            return ts.createCall(
                ts.createPropertyAccess(
                    ts.createPropertyAccess(
                        ts.createIdentifier("VROES"),
                        "Shims"),
                    "spreadArrays"),
                undefined,
                arrays.map(node => visitor.visitNode(node) as ts.Expression));
        }

        function transformSpreadAssignment(node: ts.ObjectLiteralExpression): ts.Node {
            const objects: ts.Expression[] = [];
            let currentProps: ts.ObjectLiteralElementLike[] = [];

            const addCurrentProps = () => {
                if (currentProps.length) {
                    objects.push(ts.createObjectLiteral(currentProps));
                    currentProps = [];
                }
            };

            objects.push(ts.createObjectLiteral([]));

            for (const property of node.properties) {
                if (property.kind === ts.SyntaxKind.SpreadAssignment) {
                    addCurrentProps();
                    objects.push((<ts.SpreadAssignment>property).expression);
                }
                else {
                    currentProps.push(property);
                }
            }

            addCurrentProps();

            return ts.createCall(
                ts.createPropertyAccess(
                    ts.createPropertyAccess(
                        ts.createIdentifier("VROES"),
                        "Shims"),
                    "objectAssign"),
                undefined,
                objects.map(node => visitor.visitNode(node) as ts.Expression));
        }
    }
}
