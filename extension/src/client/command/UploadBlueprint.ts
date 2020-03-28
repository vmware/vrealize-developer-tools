/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

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

        const blueprintContent = activeTextEditor.document.getText()
        const blueprintName = path.basename(activeTextEditor.document.fileName).replace(".yaml", "")
        const existingBlueprint = await restClient.getBlueprintByName(blueprintName)

        if (existingBlueprint) {
            await restClient.updateBlueprint(existingBlueprint.id, {
                name: existingBlueprint.name,
                projectId: existingBlueprint.projectId,
                content: blueprintContent
            })

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
            return Promise.reject("No blueprint selection was made")
        }

        await restClient.createBlueprint({
            name: blueprintName,
            projectId: selectedProject.id,
            content: blueprintContent
        })
    }
}
