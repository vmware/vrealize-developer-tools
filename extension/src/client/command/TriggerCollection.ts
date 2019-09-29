/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, sleep } from "vrealize-common"
import { remote } from "vro-language-server"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { LanguageServices } from "../lang"
import { Command } from "./Command"

@AutoWire
export class TriggerCollection extends Command {
    private readonly logger = Logger.get("TriggerCollection")
    private languageServices: LanguageServices

    get commandId(): string {
        return Commands.TriggerServerCollection
    }

    constructor(languageServices: LanguageServices) {
        super()
        this.languageServices = languageServices
    }

    async execute(context: vscode.ExtensionContext) {
        this.logger.info("Executing command Trigger Hint Collection")
        const languageClient = this.languageServices.client

        if (!languageClient) {
            vscode.window.showErrorMessage("The vRO language server is not running")
            return
        }

        await vscode.commands.executeCommand(Commands.EventCollectionStart)

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Window,
                title: "vRO hint collection"
            },
            progress => {
                return new Promise(async (resolve, reject) => {
                    await languageClient.sendRequest(remote.server.triggerVroCollection, false)
                    let status = await languageClient.sendRequest(remote.server.giveVroCollectionStatus)

                    while (status && !status.finished) {
                        this.logger.debug("Collection status:", status)
                        progress.report(status)
                        await sleep(500)
                        status = await languageClient.sendRequest(remote.server.giveVroCollectionStatus)
                    }

                    this.logger.debug("Collection finished:", status)

                    if (status.error !== undefined) {
                        await vscode.commands.executeCommand(Commands.EventCollectionError, status.error)

                        if (status.data.hintsPluginBuild === 0) {
                            vscode.window.showErrorMessage(
                                "The vRO Hint plug-in is not installed on the configured vRO server"
                            )
                        }
                    } else {
                        await vscode.commands.executeCommand(Commands.EventCollectionSuccess)
                    }

                    resolve()
                })
            }
        )
    }
}
