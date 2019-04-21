/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as _ from "lodash"
import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { Diagnostics } from "../constants"
import { EnvironmentManager } from "../manager"
import { Registrable } from "../Registrable"
import * as ruleDefs from "./rule"
import { LintRule } from "./LintRule"

export interface LintContext {
    environment: EnvironmentManager
}

export interface LintRulesMap {
    [key: string]: LintRule
}

type Constructable<T> = new (arg: any) => T

@AutoWire
export class Linter implements Registrable, vscode.Disposable {
    private diagnosticCollection: vscode.DiagnosticCollection

    private readonly logger = Logger.get("Linter")
    private readonly throttledDiagnostics = _.throttle(this.lintTextDocument, 500)
    private readonly lintContext: LintContext = {} as LintContext

    readonly rules: LintRulesMap

    constructor(environment: EnvironmentManager) {
        this.lintContext.environment = environment

        const rules: LintRulesMap = {}

        for (const cls of Object.values(ruleDefs)) {
            const ruleClass = cls as Constructable<any>
            const rule: LintRule = new ruleClass(this.lintContext)

            rules[rule.ruleCode] = rule
        }

        this.rules = rules
    }

    dispose() {
        this.diagnosticCollection.clear()
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering linter")

        // Hook up to workspace events
        vscode.workspace.onDidOpenTextDocument(this.lintTextDocument, this, context.subscriptions)
        vscode.workspace.onDidChangeTextDocument(this.didChangeTextDocument, this, context.subscriptions)
        vscode.workspace.onDidSaveTextDocument(this.didSaveTextDocument, this, context.subscriptions)

        this.diagnosticCollection = vscode.languages.createDiagnosticCollection(Diagnostics.LintingResults)
        context.subscriptions.push(this.diagnosticCollection)

        // lint already opened files
        ;(vscode.workspace.textDocuments || []).forEach(this.lintTextDocument, this)
    }

    private didChangeTextDocument(change: vscode.TextDocumentChangeEvent) {
        this.throttledDiagnostics(change.document)
    }

    private didSaveTextDocument(document: vscode.TextDocument) {
        this.throttledDiagnostics(document)
    }

    private lintTextDocument(document: vscode.TextDocument) {
        const relevantRules = Object.values(this.rules).filter(rule => rule.isRelevant(document))

        if (relevantRules.length <= 0) {
            return
        }

        // remove past diagnostics
        this.diagnosticCollection.delete(document.uri)

        const relativePath = vscode.workspace.asRelativePath(document.uri, false)
        this.logger.info(`Running diagnostics on file ${relativePath}`)

        const diagnostics = _.flatMap(relevantRules, rule => rule.apply(document))
        this.diagnosticCollection.set(document.uri, diagnostics)
    }
}
