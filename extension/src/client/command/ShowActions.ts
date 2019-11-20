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
export class ShowActions extends Command {
    private readonly logger = Logger.get("ShowActions")
    private restClient: VroRestClient

    get commandId(): string {
        return Commands.OpenAction
    }

    constructor(environment: EnvironmentManager, private config: ConfigurationManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Show Actions")
        const useFullyQualifiedNames = this.config.vrdev.commandPalette.useFullyQualifiedNames

        let actions: Thenable<VroElementPickInfo[]>
        if (useFullyQualifiedNames) {
            actions = this.restClient.getActions().then(result =>
                result.map(action => {
                    return {
                        id: action.id,
                        name: action.fqn,
                        label: `$(file-code) ${action.fqn}`,
                        description: `v${action.version}`
                    }
                })
            )
        } else {
            const modules: VroElementPickInfo[] = (await this.restClient.getRootCategories("ScriptModuleCategory")).map(
                category => {
                    return {
                        id: category.id,
                        name: category.name,
                        label: `$(gift) ${category.name}`
                    }
                }
            )

            const selectedModule: VroElementPickInfo | undefined = await vscode.window.showQuickPick(modules, {
                placeHolder: "Pick a module"
            })

            this.logger.debug("Selected module: ", selectedModule)

            if (!selectedModule) {
                return
            }

            actions = this.restClient.getChildrenOfCategory(selectedModule.id).then(result =>
                result.map(action => {
                    return {
                        name: `${selectedModule.name}/${action.name}`,
                        label: `$(file-code) ${selectedModule.name}/${action.name}`,
                        id: action.id
                    }
                })
            )
        }

        const selectedAction: VroElementPickInfo | undefined = await vscode.window.showQuickPick(actions, {
            placeHolder: "Pick an action"
        })

        this.logger.debug("Selected action: ", selectedAction)

        if (!selectedAction) {
            return
        }

        const url = ContentLocation.with({
            scheme: ContentLocation.VRO_URI_SCHEME,
            type: ElementKinds.Action,
            name: selectedAction.name,
            extension: "js",
            id: selectedAction.id
        })

        this.logger.debug(`Opening the selected action: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
