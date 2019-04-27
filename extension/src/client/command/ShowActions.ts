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
export class ShowActions extends Command {
    private readonly logger = Logger.get("ShowActions")
    private languageServices: LanguageServices

    get commandId(): string {
        return Commands.OpenAction
    }

    constructor(languageServices: LanguageServices) {
        super()
        this.languageServices = languageServices
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Show Actions")
        const config = vscode.workspace.getConfiguration("vrdev")
        const useFullyQualifiedNames = config.get<boolean>("commandPalette.useFullyQualifiedNames")
        const languageClient = this.languageServices.client

        if (!languageClient) {
            vscode.window.showErrorMessage("The vRO language server is not running")
            return
        }

        let actions: VroElementPickInfo[]
        if (useFullyQualifiedNames) {
            actions = await languageClient.sendRequest(remote.server.giveAllActions)
        } else {
            const modules: VroElementPickInfo[] = await languageClient.sendRequest(remote.server.giveActionModules)
            const selectedModule: VroElementPickInfo | undefined = await vscode.window.showQuickPick(modules, {
                placeHolder: "Pick a module"
            })

            this.logger.debug("Selected module: ", selectedModule)

            if (!selectedModule) {
                return
            }

            actions = await languageClient.sendRequest(remote.server.giveActionsForModule, selectedModule.name)
        }

        const selectedAction: VroElementPickInfo | undefined = await vscode.window.showQuickPick(actions, {
            placeHolder: "Pick an action"
        })

        this.logger.debug("Selected action: ", selectedAction)

        if (!selectedAction) {
            return
        }

        const url = ContentLocation.with({
            scheme: "vro",
            type: "action",
            name: selectedAction.name,
            extension: "js",
            id: selectedAction.id || ""
        })

        this.logger.debug(`Opening the selected action: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
