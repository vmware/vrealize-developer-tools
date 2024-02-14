/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, sleep } from "@vmware/vrdt-common"
import { remote } from "@vmware/vro-language-server"
import * as vscode from "vscode"
import { LanguageClient } from "vscode-languageclient"
import { CollectionStatus } from "packages/node/vro-language-server/src/server/request/collection/ServerCollection"

import { Commands, LanguageServerConfig } from "../constants"
import { LanguageServices } from "../lang"
import { Command } from "./Command"

@AutoWire
export class TriggerCollection extends Command<void> {
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
            this.logger.warn(`The ${LanguageServerConfig.DisplayName} is not running`)
            return
        }
        await vscode.commands.executeCommand(Commands.EventCollectionStart)

        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Window,
                title: "vRO hint collection"
            },
            async progress => {
                return new Promise<void>(async (resolve, reject) => {
                    const status: CollectionStatus = await this.triggerVroDataCollection(languageClient, progress)
                    if (status.error !== undefined) {
                        reject(new Error(`Failed to trigger data collection from vRO: ${status.error}`))
                    }
                    resolve()
                })
            }
        )
    }

    private async triggerVroDataCollection(languageClient: LanguageClient, progress: any): Promise<CollectionStatus> {
        await languageClient.sendRequest(remote.server.triggerVroCollection, false)
        let status = await languageClient.sendRequest(remote.server.giveVroCollectionStatus)

        // wait for status change
        while (status && !status.finished) {
            this.logger.info("Collection status:", status)
            progress.report(status)
            await sleep(LanguageServerConfig.SleepTime)
            status = await languageClient.sendRequest(remote.server.giveVroCollectionStatus)
        }
        // check for error response
        if (status.error !== undefined) {
            await vscode.commands.executeCommand(Commands.EventCollectionError, status.error)
            return status
        }
        await vscode.commands.executeCommand(Commands.EventCollectionSuccess)

        return status
    }
}
