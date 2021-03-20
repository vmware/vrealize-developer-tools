/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Command } from "./Command"
import { Commands } from "../constants"
import { PackageNode } from "../provider/explorer/model"
import { ConfigurationManager, EnvironmentManager } from "../system"

const LABEL_DELETE = "Delete"
const LABEL_DELETE_KEEP_SHARED = "Delete (Keep Shared)"
const LABEL_DELETE_WITH_CONTENT = "Delete (With Content)"

@AutoWire
export class DeletePackage extends Command<void> {
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
                LABEL_DELETE,
                LABEL_DELETE_KEEP_SHARED,
                LABEL_DELETE_WITH_CONTENT
            )
            .then(async selected => {
                try {
                    switch (selected) {
                        case LABEL_DELETE:
                            await this.restClient.deletePackage(fullName, "deletePackage")
                            vscode.commands.executeCommand(Commands.RefreshExplorer)
                            break
                        case LABEL_DELETE_KEEP_SHARED:
                            await this.restClient.deletePackage(fullName, "deletePackageKeepingShared")
                            vscode.commands.executeCommand(Commands.RefreshExplorer)
                            break
                        case LABEL_DELETE_WITH_CONTENT:
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
