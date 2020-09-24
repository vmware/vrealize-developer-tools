
/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    const ts: typeof import("typescript") = require("typescript");

    export interface DiagnosticCollection {
        add(diagnostic: Diagnostic): void;
        addAtNode(file: ts.SourceFile, node: ts.Node, message: string, category: DiagnosticCategory): void;
        addNative(diagnostic: ts.Diagnostic): void;
        toArray(): Diagnostic[];
    }

    export function createDiagnosticCollection(): DiagnosticCollection {
        const items: Diagnostic[] = [];
        return {
            add: (diagnostic: Diagnostic) => {
                items.push(diagnostic);
            },
            addAtNode: (file: ts.SourceFile, node: ts.Node, message: string, category: DiagnosticCategory) => {
                const lineAndChar = file.getLineAndCharacterOfPosition(node.getStart());
                items.push({
                    file: system.relativePath(system.getCurrentDirectory(), file.fileName),
                    line: lineAndChar.line + 1,
                    col: lineAndChar.character + 1,
                    messageText: message,
                    category: category,
                });
            },
            addNative: (d: ts.Diagnostic) => {
                const diagnostic: Diagnostic = {
                    file: undefined,
                    line: undefined,
                    col: undefined,
                    messageText: typeof d.messageText === "string" ? d.messageText : d.messageText.messageText,
                    category: <number>d.category,
                };
                if (d.file) {
                    diagnostic.file = system.relativePath(system.getCurrentDirectory(), d.file.fileName);
                    const pos = d.file.getLineAndCharacterOfPosition(d.start);
                    diagnostic.line = pos.line + 1;
                    diagnostic.col = pos.character + 1;
                }
                items.push(diagnostic);
            },
            toArray(): Diagnostic[] {
                return items;
            }
        };
    }
}