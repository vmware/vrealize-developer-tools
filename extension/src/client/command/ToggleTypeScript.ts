/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { ConfigurationManager } from "../manager"
import { Command } from "./Command"

@AutoWire
export class ToggleTypeScript extends Command {
    private readonly logger = Logger.get("ToggleTypeScript")

    constructor(private config: ConfigurationManager) {
        super()
    }

    get commandId(): string {
        return Commands.ToggleTypeScript
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Toggle TypeScript Support")
        const value = this.config.vrdev.experimental.typescript
        await vscode.workspace
            .getConfiguration("vrdev")
            .update("experimental.typescript", !value, vscode.ConfigurationTarget.Global)
        vscode.window.showInformationMessage(`${!value ? "Enabled" : "Disabled"} vRealize TypeScript support`)
    }
}
