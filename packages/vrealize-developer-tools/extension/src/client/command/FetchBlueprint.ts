/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"
import { parse as parseYaml, Document as YamlDocument } from "yaml"

import { Commands } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../system"
import { VraIdentityStore } from "../storage"
import { BaseVraCommand } from "./BaseVraCommand"

interface BlueprintPickInfo extends vscode.QuickPickItem {
    id: string
    name: string
}

@AutoWire
export class GetBlueprint extends BaseVraCommand {
    private readonly logger = Logger.get("FetchBlueprint")

    get commandId(): string {
        return Commands.FetchBlueprint
    }

    constructor(env: EnvironmentManager, config: ConfigurationManager, identity: VraIdentityStore) {
        super(env, config, identity)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        const restClient = await this.getRestClient()

        const blueprintsFuture: Thenable<BlueprintPickInfo[]> = restClient.getBlueprints().then(result =>
            result.map(blueprint => {
                return {
                    id: blueprint.id,
                    name: blueprint.name,
                    label: `$(circuit-board) ${blueprint.name}`,
                    description: blueprint.projectName
                }
            })
        )

        const selected: BlueprintPickInfo | undefined = await vscode.window.showQuickPick(blueprintsFuture, {
            placeHolder: "Pick a blueprint",
            matchOnDescription: true
        })

        this.logger.debug("Selected blueprint: ", selected)

        if (!selected) {
            this.logger.warn("No blueprint selection was made")
            return
        }

        const blueprintYaml = new YamlDocument()
        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Fetching blueprint '${selected.name}'`,
                cancellable: false
            },
            async () => {
                const blueprint = await restClient.getBlueprintById(selected.id)

                blueprintYaml.contents = {
                    id: blueprint.id,
                    name: blueprint.name,
                    description: blueprint.description,
                    requestScopeOrg: blueprint.requestScopeOrg,
                    content: parseYaml(blueprint.content)
                }
            }
        )

        if (!blueprintYaml.contents) {
            return Promise.reject("Could not fetch blueprint or it has empty content")
        }

        const workspaceFolder = await this.askForWorkspace("Select the workspace where a new blueprint will be created")

        const newFile = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.parse(path.join(workspaceFolder.uri.fsPath, `${selected.name}.yaml`)),
            filters: {
                YAML: ["yaml", "yml"]
            }
        })

        if (!newFile) {
            this.logger.warn("Save dialog was canceled")
            return
        }

        this.logger.debug(`Saving the selected blueprint at ${newFile.toString()}`)
        await vscode.workspace.fs.writeFile(newFile, Buffer.from(blueprintYaml.toString()))
        await vscode.window.showTextDocument(newFile, { preview: false })
    }
}
