/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    interface Closure {
        readonly parent: Closure;
        getIdentifier(name: string): ClosureIdentifierType;
        addIdentifier(name: string, type: ClosureIdentifierType): void;
        newClosure(): Closure;
    }

    enum ClosureIdentifierType {
        Import,
        MethodParameter,
        Variable,
        Function,
    }

    function createClosure(parent?: Closure): Closure {
        const identifiers: Record<string, ClosureIdentifierType> = {};
        const closure: Closure = {
            parent,
            getIdentifier: function (name: string): ClosureIdentifierType {
                if (name !== undefined && name !== null) {
                    let type = identifiers[name];
                    if (type === undefined && parent) {
                        type = parent.getIdentifier(name);
                    }
                    return type;
                }
            },
            addIdentifier: function (name: string, type: ClosureIdentifierType): void {
                if (name !== undefined && name !== null) {
                    identifiers[name] = type;
                }
            },
            newClosure: function (): Closure {
                return createClosure(closure);
            }
        };
        return closure;
    }

    export function transformNode(sourceFile: ts.SourceFile, context: ScriptTransformationContext): ts.SourceFile {
        const visitor = createVisitor(visitNode, context);
        let closure = createClosure();

        // Save a local copy of require facts and remove it from global facts
        const containsRequire = (context.file.hierarchyFacts & HierarchyFacts.ContainsRequire) > 0;
        context.file.hierarchyFacts &= ~HierarchyFacts.ContainsRequire;

        return visitSourceFile(sourceFile);

        function visitNode(node: ts.Node): ts.VisitResult<ts.Node> {
            switch (node.kind) {
                case ts.SyntaxKind.Identifier:
                    return visitIdentifier(<ts.Identifier>node);
                case ts.SyntaxKind.VariableDeclaration:
                    return visitVariableDeclaration(node as ts.VariableDeclaration);
                case ts.SyntaxKind.FunctionDeclaration:
                    return visitFunctionDeclaration(node as ts.FunctionDeclaration);
                case ts.SyntaxKind.FunctionExpression:
                    return visitFunctionExpression(node as ts.FunctionExpression);
                case ts.SyntaxKind.CallExpression:
                    return visitCallExpression(node as ts.CallExpression);
                case ts.SyntaxKind.BinaryExpression:
                    return visitBinaryExpression(node as ts.BinaryExpression);
            }
        }

        function visitSourceFile(node: ts.SourceFile): ts.SourceFile {
            const statements = visitor.visitNodes(node.statements);
            const prologue = createPrologueStatements();
            const epilogue = createEpilogueStatements();

            return ts.updateSourceFileNode(
                node,
                ts.setTextRange(
                    ts.createNodeArray([
                        ...prologue,
                        ...statements,
                        ...epilogue
                    ]),
                    node.statements));
        }

        function visitIdentifier(node: ts.Identifier): ts.Node {
            const identifierType = closure.getIdentifier(node.text);
            if (node.text === SCRIPT_VRO_GLOBAL && identifierType === undefined) {
                context.file.hierarchyFacts |= HierarchyFacts.ContainsGlobalReference;
            }
            else if (identifierType === ClosureIdentifierType.Import && isLazyImportedIdentifier(node)) {
                context.file.hierarchyFacts |= HierarchyFacts.ContainsVroesReference;
                return ts.createPropertyAccess(node, "_");
            }
            return visitor.visitEachChild(node);
        }

        function visitFunctionDeclaration(node: ts.FunctionDeclaration): ts.FunctionDeclaration {
            closure = closure.newClosure();
            node.parameters.forEach(param => {
                registerFunctionParameter(param.name);
            });
            if (node.body) {
                const body = visitor.visitNode(node.body) as ts.Block;
                node = ts.updateFunctionDeclaration(
                    node,
                    node.decorators,
                    node.modifiers,
                    node.asteriskToken,
                    node.name,
                    node.typeParameters,
                    node.parameters,
                    node.type,
                    body);
            }
            closure = closure.parent;
            return node;
        }

        function visitFunctionExpression(node: ts.FunctionExpression): ts.FunctionExpression {
            closure = closure.newClosure();
            node.parameters.forEach(param => {
                registerFunctionParameter(param.name);
            });
            if (node.body) {
                const body = visitor.visitNode(node.body) as ts.Block;
                node = ts.updateFunctionExpression(
                    node,
                    node.modifiers,
                    node.asteriskToken,
                    node.name,
                    node.typeParameters,
                    node.parameters,
                    node.type,
                    body);
            }
            closure = closure.parent;
            return node;
        }

        function visitVariableDeclaration(node: ts.VariableDeclaration): ts.VariableDeclaration {
            const varName = getIdentifierTextOrNull(node.name);
            if (varName) {
                if (containsRequire && node.initializer && isRequireCall(node.initializer)) {
                    let requireCallNode = tryUpdateLocalRequireCall(node.initializer as ts.CallExpression);
                    requireCallNode = ts.updateCall(
                        requireCallNode,
                        ts.createPropertyAccess(ts.createIdentifier("VROES"), "importLazy"),
                        /* typeArguments */ undefined,
                        requireCallNode.arguments);
                    node = ts.createVariableDeclaration(
                        node.name,
                        node.type,
                        requireCallNode);
                    closure.addIdentifier(varName, ClosureIdentifierType.Import);
                    context.file.hierarchyFacts |= HierarchyFacts.ContainsVroesReference;
                    return node;
                }
                
                    node = visitor.visitEachChild(node);
                    closure.addIdentifier(varName, ClosureIdentifierType.Variable);
                    return node;
                
            }
            return visitor.visitEachChild(node);
        }

        function visitCallExpression(node: ts.CallExpression): ts.CallExpression {
            if (containsRequire && isRequireCall(node)) {
                node = tryUpdateLocalRequireCall(node);
                context.file.hierarchyFacts |= HierarchyFacts.ContainsRequire;
            }
            return visitor.visitEachChild(node);
        }

        function visitBinaryExpression(node: ts.BinaryExpression): ts.Node {
            if (node.parent && node.parent.kind === ts.SyntaxKind.ExpressionStatement && isFirstAssignedOnImport(node)) {
                node = visitor.visitEachChild(node);
                const varName = getIdentifierTextOrNull(node.left);
                closure.addIdentifier(varName, ClosureIdentifierType.Variable);
                return node;
            }
            return visitor.visitEachChild(node);
        }

        function isFirstAssignedOnImport(node: ts.BinaryExpression): boolean {
            if (!node.operatorToken || node.operatorToken.kind !== ts.SyntaxKind.FirstAssignment) {
                return false;
            }

            if (!node.left || node.left.kind !== ts.SyntaxKind.Identifier) {
                return false;
            }

            const idenitfier = node.left as ts.Identifier;
            if (closure.getIdentifier(idenitfier.text) !== ClosureIdentifierType.Import) {
                return false;
            }

            return true;
        }

        function isLazyImportedIdentifier(node: ts.Identifier): boolean {
            const parent = node.parent;
            if (!parent) {
                return false;
            }

            switch (parent.kind) {
                case ts.SyntaxKind.BinaryExpression:
                    {
                        const binaryExpressionNode = parent as ts.BinaryExpression;
                        if (binaryExpressionNode.operatorToken.kind === ts.SyntaxKind.FirstAssignment && node === binaryExpressionNode.left) {
                            return false;
                        }
                    }
                    break;
                case ts.SyntaxKind.VariableDeclaration:
                    {
                        const variableDeclarationNode = parent as ts.VariableDeclaration;
                        if (node === variableDeclarationNode.name) {
                            return false;
                        }
                    }
                    break;
                case ts.SyntaxKind.PropertyAssignment:
                    {
                        const propertyAssignmentNode = parent as ts.PropertyAssignment;
                        if (node === propertyAssignmentNode.name) {
                            return false;
                        }
                    }
                    break;
                case ts.SyntaxKind.PropertyAccessExpression:
                    {
                        const propertyAccessNode = parent as ts.PropertyAccessExpression;
                        if (node === propertyAccessNode.name) {
                            return false;
                        }
                    }
                    break;
            }

            return true;
        }

        function createPrologueStatements(): ts.Statement[] {
            const statements: ts.Statement[] = [];
            const variableDeclarations: ts.VariableDeclaration[] = [];
            if (context.file.hierarchyFacts & HierarchyFacts.GlobalScope || context.globalIdentifiers.length) {
                // Create the following statement:
                // var __global = (function () {
                //     return this;
                // }).call(null);
                statements.push(ts.createVariableStatement(
                    /*modifiers*/ undefined,
                    [
                        ts.createVariableDeclaration(
                            /*name*/ SCRIPT_VRO_GLOBAL,
                            /*type*/ undefined,
                            ts.createBinary(
                                ts.createCall(
                                    ts.createPropertyAccess(ts.createIdentifier("System"), "getContext"),
                                    /*typeArguments*/ undefined,
                                    /*argumentsArray*/ undefined),
                                ts.createToken(ts.SyntaxKind.BarBarToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createParen(
                                            ts.createFunctionExpression(
                                            /*modifiers*/ undefined,
                                            /*asteriskToken*/ undefined,
                                            /*name*/ undefined,
                                            /*typeParameters*/ undefined,
                                            /*parameters*/ undefined,
                                            /*modifiers*/ undefined,
                                            /*body*/ ts.createBlock([ts.createReturn(ts.createThis())], true))),
                                        "call"
                                    ),
                                /*typeArguments*/ undefined,
                                /*argumentsArray*/[ts.createNull()]
                                )
                            )
                        )
                    ]));
            }

            if (context.file.hierarchyFacts & HierarchyFacts.VROES) {
                // var VROES = __global.VROES || (__global.VROES = System.getModule("com.vmware.pscoe.library.ecmascript").VROES())
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        /*name*/ SCRIPT_VROES_VAR,
                        /*type*/ undefined,
                        ts.createBinary(
                            ts.createPropertyAccess(
                                ts.createIdentifier(SCRIPT_VRO_GLOBAL),
                                "__VROES"
                            ),
                            ts.createToken(ts.SyntaxKind.BarBarToken),
                            ts.createParen(
                                ts.createBinary(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier(SCRIPT_VRO_GLOBAL),
                                        "__VROES"
                                    ),
                                    ts.createToken(ts.SyntaxKind.EqualsToken),
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createCall(
                                                ts.createPropertyAccess(ts.createIdentifier("System"), "getModule"),
                                                /* typeArguments */ undefined,
                                                [
                                                    ts.createLiteral("com.vmware.pscoe.library.ecmascript")
                                                ]),
                                            "VROES"
                                        ),
                                        /* typeArguments */ undefined,
                                        /* argumentsArray */ undefined
                                    )
                                )
                            )
                        )
                    ));
            }

            if (context.file.hierarchyFacts & HierarchyFacts.ContainsRequire) {
                // var require = VROES.require
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "require",
                        /*type*/ undefined,
                        ts.createPropertyAccess(
                            ts.createIdentifier(SCRIPT_VROES_VAR),
                            "require"
                        )
                    ));
            }

            if (!(context.file.hierarchyFacts & HierarchyFacts.ContainsActionClosure) && context.file.type === FileType.Action) {
                // var exports = {}
                variableDeclarations.push(
                    ts.createVariableDeclaration(
                        "exports",
                        /*type*/ undefined,
                        ts.createObjectLiteral([])
                    ));
            }

            if (variableDeclarations.length) {
                statements.push(ts.createVariableStatement(/*modifiers*/ undefined, variableDeclarations));
            }

            return statements;
        }

        function createEpilogueStatements(): ts.Statement[] {
            const statements: ts.Statement[] = [];

            if (!(context.file.hierarchyFacts & HierarchyFacts.ContainsActionClosure) && context.file.type === FileType.Action) {
                statements.push(ts.createReturn(ts.createIdentifier("exports")));
            }

            return statements;
        }

        function tryUpdateLocalRequireCall(requireCallNode: ts.CallExpression): ts.CallExpression {
            if (requireCallNode.arguments[0].kind === ts.SyntaxKind.StringLiteral) {
                const importSpecifierNode = requireCallNode.arguments[0] as ts.StringLiteral;
                if (importSpecifierNode.text && importSpecifierNode.text[0] === ".") {
                    let moduleName = system.normalizePath(system.joinPath(context.file.relativeDirPath, importSpecifierNode.text));
                    if (context.actionsNamespace) {
                        moduleName = `${context.actionsNamespace}.${moduleName}`;
                    }
                    requireCallNode = ts.updateCall(
                        requireCallNode,
                        requireCallNode.expression,
                        /* typeArguments */ undefined,
                        [ts.createStringLiteral(moduleName)]);
                }
            }
            return requireCallNode;
        }

        function registerFunctionParameter(name: ts.BindingName): void {
            if (!name) {
                return;
            }
            switch (name.kind) {
                case ts.SyntaxKind.Identifier:
                    closure.addIdentifier((name as ts.Identifier).text, ClosureIdentifierType.MethodParameter);
                    break;
                case ts.SyntaxKind.ObjectBindingPattern:
                    {
                        const bindingPattern = name as ts.ObjectBindingPattern;
                        if (bindingPattern.elements) {
                            bindingPattern.elements.forEach(ele => {
                                registerFunctionParameter(ele.name);
                            });
                        }
                    }
                    break;
                case ts.SyntaxKind.ArrayBindingPattern:
                    {
                        const bindingPattern = name as ts.ArrayBindingPattern;
                        if (bindingPattern.elements) {
                            bindingPattern.elements
                                .filter(ele => ele.kind === ts.SyntaxKind.BindingElement)
                                .forEach((ele: ts.BindingElement) => {
                                    registerFunctionParameter(ele.name);
                                });
                        }
                    }
                    break;
            }
        }
    }
}
