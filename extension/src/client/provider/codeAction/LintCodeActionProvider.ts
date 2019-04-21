/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "vrealize-common"
import * as vscode from "vscode"

import { Linter } from "../../lint"
import { EnvironmentManager } from "../../manager"
import { ClientWindow } from "../../ui"
import { Registrable } from "../../Registrable"

export abstract class LintCodeActionProvider implements vscode.CodeActionProvider, Registrable {
    protected abstract readonly logger: Logger

    constructor(protected linter: Linter, protected environment: EnvironmentManager) {}

    protected abstract get documentSelector(): vscode.DocumentSelector
    protected abstract get fixCommandId(): string

    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void {
        this.logger.debug(`Registering lint code action provider with document selector ${this.documentSelector}`)

        context.subscriptions.push(
            vscode.languages.registerCodeActionsProvider(this.documentSelector, this),
            vscode.commands.registerCommand(this.fixCommandId, this.fixLine, this)
        )
    }

    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range,
        codeActionContext: vscode.CodeActionContext
    ): vscode.CodeAction[] {
        const codeActions: vscode.CodeAction[] = []
        const diagnostics = codeActionContext.diagnostics || []

        diagnostics
            .filter(diagnostic => diagnostic.source === this.environment.displayName)
            .forEach(diagnostic => {
                const ruleName = diagnostic.message.split(":")[0]
                const ruleCode = diagnostic.code || "unknown-code"

                if (diagnostic.range.isSingleLine && this.linter.rules[ruleCode]) {
                    const fixTitle = `Fix: ${ruleName}`
                    const fixAction = new vscode.CodeAction(fixTitle, vscode.CodeActionKind.QuickFix)
                    fixAction.command = {
                        title: fixTitle,
                        command: this.fixCommandId,
                        arguments: [diagnostic.range, ruleCode]
                    }

                    fixAction.diagnostics = [diagnostic]
                    codeActions.push(fixAction)
                }
            })

        return codeActions
    }

    private fixLine(range: vscode.Range, ruleCode: string) {
        return new Promise((resolve, reject) => {
            const editor = vscode.window.activeTextEditor
            const line = editor && editor.document.lineAt(range.start.line)
            const text = line && line.text.substring(range.start.character, range.end.character)
            const rule = this.linter.rules[ruleCode]
            const fixedText = rule && rule.fix(text || "")

            if (editor && typeof fixedText === "string") {
                editor
                    .edit(editBuilder => {
                        editBuilder.replace(range, fixedText)
                    })
                    .then(resolve, reject)
            } else {
                reject()
            }
        })
    }
}
