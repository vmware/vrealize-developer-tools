/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroElementPickInfo, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, ElementKinds } from "../constants"
import { Command } from "./Command"
import { ContentLocation } from "../provider/content/ContentLocation"
import { ConfigurationManager, EnvironmentManager } from "../manager"

@AutoWire
export class ShowResources extends Command {
    private readonly logger = Logger.get("ShowResources")
    private restClient: VroRestClient

    get commandId(): string {
        return Commands.OpenResource
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Show Resources")

        const resources: Thenable<VroElementPickInfo[]> = this.restClient.getResources().then(result =>
            result.map(res => {
                return {
                    id: res.id,
                    name: res.name,
                    label: `$(file-code) ${res.name}`
                }
            })
        )

        const selected: VroElementPickInfo | undefined = await vscode.window.showQuickPick(resources, {
            placeHolder: "Pick a resource"
        })

        this.logger.debug("Selected resource: ", selected)

        if (!selected) {
            return
        }

        const [name, extension] = selected.name.split(".")
        const url = ContentLocation.with({
            scheme: ContentLocation.VRO_URI_SCHEME,
            type: ElementKinds.Resource,
            id: selected.id,
            name,
            extension
        })

        this.logger.debug(`Opening the selected resource: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
