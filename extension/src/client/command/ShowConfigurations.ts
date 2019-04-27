/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroElementPickInfo } from "vrealize-common"
import { remote } from "vro-language-server"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { LanguageServices } from "../lang"
import { Command } from "./Command"
import { ContentLocation } from "../provider/content/ContentLocation";

@AutoWire
export class ShowConfigurations extends Command {
    private readonly logger = Logger.get("ShowConfigurations")
    private languageServices: LanguageServices

    get commandId(): string {
        return Commands.OpenConfiguration
    }

    constructor(languageServices: LanguageServices) {
        super()
        this.languageServices = languageServices
    }

    async execute(context: vscode.ExtensionContext) {
        this.logger.info("Executing command Show Configurations")
        const config = vscode.workspace.getConfiguration("vrdev")
        const useFullyQualifiedNames = config.get<boolean>("commandPalette.useFullyQualifiedNames")
        const languageClient = this.languageServices.client

        if (!languageClient) {
            vscode.window.showErrorMessage("The vRO language server is not running")
            return
        }

        let configs: VroElementPickInfo[]
        if (useFullyQualifiedNames) {
            configs = await languageClient.sendRequest(remote.server.giveAllConfigElements)
        } else {
            const categories: VroElementPickInfo[] = await languageClient.sendRequest(
                remote.server.giveConfigCategories
            )

            const selectedCategory: VroElementPickInfo | undefined = await vscode.window.showQuickPick(categories, {
                placeHolder: "Pick a category path"
            })

            this.logger.debug("Selected category: ", selectedCategory)

            if (!selectedCategory) {
                return
            }

            configs = await languageClient.sendRequest(remote.server.giveConfigsForCategory, selectedCategory.name)
        }

        const selectedConfig: VroElementPickInfo | undefined = await vscode.window.showQuickPick(configs, {
            placeHolder: "Pick a configuration element"
        })

        this.logger.debug("Selected configuration element: ", selectedConfig)

        if (!selectedConfig) {
            return
        }

        const url = ContentLocation.with({
            scheme: "vro",
            type: "configuration",
            name: selectedConfig.name,
            extension: "xml",
            id: selectedConfig.id || ""
        })

        this.logger.debug(`Opening the selected configuration element: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
