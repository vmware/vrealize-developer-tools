/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Command } from "./Command"
import { Commands } from "../constants"
import { PackageNode } from "../provider/explorer/model"
import { ConfigurationManager, EnvironmentManager } from "../manager"

@AutoWire
export class DeletePackage extends Command {
    private readonly logger = Logger.get("DeletePackage")
    private readonly restClient: VroRestClient

    get commandId(): string {
        return Commands.DeletePackage
    }

    constructor(config: ConfigurationManager, environment: EnvironmentManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
    }

    async execute(context: vscode.ExtensionContext, node: PackageNode): Promise<void> {
        this.logger.info("Executing command Delete Package")
        const fullName = `${node.name}${node.version ? `-${node.version}` : ""}`
        vscode.window
            .showWarningMessage(
                `Delete package ${fullName}?`,
                { modal: true },
                "Delete",
                "Delete (Keep Shared)",
                "Delete (With Content)"
            )
            .then(async selected => {
                try {
                    switch (selected) {
                        case "Delete":
                            await this.restClient.deletePackage(fullName, "deletePackage")
                            vscode.commands.executeCommand(Commands.RefreshExplorer)
                            break
                        case "Delete (Keep Shared)":
                            await this.restClient.deletePackage(fullName, "deletePackageKeepingShared")
                            vscode.commands.executeCommand(Commands.RefreshExplorer)
                            break
                        case "Delete (With Content)":
                            await this.restClient.deletePackage(fullName, "deletePackageWithContent")
                            vscode.commands.executeCommand(Commands.RefreshExplorer)
                            break
                    }
                } catch (e) {
                    vscode.window.showErrorMessage(e.message)
                }
            })
    }
}
