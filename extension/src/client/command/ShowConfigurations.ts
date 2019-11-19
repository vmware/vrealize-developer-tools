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
export class ShowConfigurations extends Command {
    private readonly logger = Logger.get("ShowConfigurations")
    private restClient: VroRestClient

    get commandId(): string {
        return Commands.OpenConfiguration
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Show Configurations")

        const configs: Thenable<VroElementPickInfo[]> = this.restClient.getConfigurations().then(result =>
            result.map(conf => {
                return {
                    id: conf.id,
                    name: conf.name,
                    label: `$(file-code) ${conf.name}`,
                    description: conf.version ? `v${conf.version}` : undefined
                }
            })
        )

        const selected: VroElementPickInfo | undefined = await vscode.window.showQuickPick(configs, {
            placeHolder: "Pick a configuration"
        })

        this.logger.debug("Selected configuration: ", selected)

        if (!selected) {
            return
        }

        const url = ContentLocation.with({
            scheme: ContentLocation.VRO_URI_SCHEME,
            type: ElementKinds.Configuraion,
            name: selected.name,
            extension: "xml",
            id: selected.id
        })

        this.logger.debug(`Opening the selected configuration: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
