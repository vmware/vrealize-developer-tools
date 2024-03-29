/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "@vmware/vrdt-common"
import * as vscode from "vscode"

import { FixCommands } from "../../constants"
import { Linter } from "../../lint"
import { EnvironmentManager } from "../../system"
import { LintCodeActionProvider } from "./LintCodeActionProvider"

@AutoWire
export class PomCodeActionProvider extends LintCodeActionProvider {
    protected readonly logger = Logger.get("PomCodeActionProvider")

    constructor(linter: Linter, environment: EnvironmentManager) {
        super(linter, environment)
    }

    protected get fixCommandId(): string {
        return FixCommands.PomFixLine
    }

    protected get documentSelector(): vscode.DocumentSelector {
        return {
            language: "xml",
            scheme: "file",
            pattern: "**/pom.xml"
        }
    }
}
