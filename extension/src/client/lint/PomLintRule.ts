/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as vscode from "vscode"

import { LintRule } from "./LintRule"

export abstract class PomLintRule extends LintRule {
    isRelevant(document: vscode.TextDocument): boolean {
        return (
            document.languageId === "xml" &&
            document.uri.scheme === "file" &&
            path.basename(document.fileName) === "pom.xml"
        )
    }
}
