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
export class ShowWorkflows extends Command {
    private readonly logger = Logger.get("ShowWorkflows")
    private restClient: VroRestClient

    get commandId(): string {
        return Commands.OpenWorkflow
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Show Workflows")

        const workflows: Thenable<VroElementPickInfo[]> = this.restClient.getWorkflows().then(result =>
            result.map(wf => {
                return {
                    id: wf.id,
                    name: wf.name,
                    label: `$(file-code) ${wf.name}`,
                    description: `v${wf.version}`
                }
            })
        )

        const selected: VroElementPickInfo | undefined = await vscode.window.showQuickPick(workflows, {
            placeHolder: "Pick a workflow"
        })

        this.logger.debug("Selected workflow: ", selected)

        if (!selected) {
            return
        }

        const url = ContentLocation.with({
            scheme: ContentLocation.VRO_URI_SCHEME,
            type: ElementKinds.Workflow,
            name: selected.name,
            extension: "xml",
            id: selected.id
        })

        this.logger.debug(`Opening the selected workflow: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
