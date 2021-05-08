/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"

import { LintContext } from "./Linter"

export abstract class LintRule {
    constructor(protected lintContext: LintContext) {}

    abstract get ruleCode(): string

    abstract isRelevant(document: vscode.TextDocument): boolean
    abstract apply(document: vscode.TextDocument): vscode.Diagnostic[]
    abstract fix(text: string): string
}
