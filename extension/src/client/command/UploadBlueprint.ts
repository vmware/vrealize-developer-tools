/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"

import { Commands } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../system"
import { BaseVraCommand } from "./BaseVraCommand"
import { VraIdentityStore } from "../storage"
import { IdentityQuickPickItem } from "../ui/MultiStepInput"

@AutoWire
export class UploadBlueprint extends BaseVraCommand {
    private readonly logger = Logger.get("UploadBlueprint")

    get commandId(): string {
        return Commands.UploadBlueprint
    }

    constructor(env: EnvironmentManager, config: ConfigurationManager, identity: VraIdentityStore) {
        super(env, config, identity)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info(`Executing command UploadBlueprint`)

        const activeTextEditor = vscode.window.activeTextEditor
        if (!activeTextEditor) {
            vscode.window.showErrorMessage("There is no opened file in the editor")
            return
        }

        if (activeTextEditor.document.languageId !== "yaml") {
            vscode.window.showErrorMessage("The currently opened file is not a YAML file")
            return
        }

        const restClient = await this.getRestClient()

        const blueprintYaml = parseYaml(activeTextEditor.document.getText())
        const blueprintName = blueprintYaml.name || path.basename(activeTextEditor.document.fileName).replace(".yaml", "")
        const blueprintDescription = blueprintYaml.description || ""
        const existingBlueprint = blueprintYaml.id
            ? await restClient.getBlueprintById(blueprintYaml.id)
            : await restClient.getBlueprintByName(blueprintName)

        if (existingBlueprint) {
            await restClient.updateBlueprint(existingBlueprint.id, {
                name: existingBlueprint.name,
                description: blueprintDescription,
                projectId: existingBlueprint.projectId,
                content: stringifyYaml(blueprintYaml.content)
            })

            vscode.window.showInformationMessage(`Blueprint '${blueprintName}' has been updated`)
            return
        }

        const projectsFuture: Thenable<IdentityQuickPickItem[]> = restClient.getProjects().then(result =>
            result.map(project => {
                return {
                    id: project.id,
                    name: project.name,
                    label: `$(organization) ${project.name}`,
                    description: project.description
                }
            })
        )

        const selectedProject: IdentityQuickPickItem | undefined = await vscode.window.showQuickPick(projectsFuture, {
            placeHolder: "Pick a project"
        })

        this.logger.debug("Selected project: ", selectedProject)

        if (!selectedProject) {
            this.logger.warn("No project selection was made")
            return
        }

        await restClient.createBlueprint({
            name: blueprintName,
            description: blueprintDescription,
            projectId: selectedProject.id,
            content: stringifyYaml(blueprintYaml.content)
        })

        vscode.window.showInformationMessage(`Blueprint '${blueprintName}' has been created`)
    }
}
