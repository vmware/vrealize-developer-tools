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

@AutoWire
export class CreateBlueprint extends BaseVraCommand {
    private readonly logger = Logger.get("CreateBlueprint")

    get commandId(): string {
        return Commands.CreateBlueprint
    }

    constructor(env: EnvironmentManager, config: ConfigurationManager, identity: VraIdentityStore) {
        super(env, config, identity)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command CreateBlueprint")

        if (this.env.workspaceFolders.length == 0) {
            this.logger.error("CreateBlueprint:execute() No opened workspace folders")
            return Promise.reject("There are no workspace folders opened in this window")
        }

        const workspaceFolder = await this.askForWorkspace("Select the workspace where a new blueprint will be created")
        const blueprintName = await this.askForBlueprintName()

        const newFile = vscode.Uri.parse(`untitled:${path.join(workspaceFolder.uri.path, `${blueprintName}.yaml`)}`)

        const document = await vscode.workspace.openTextDocument(newFile)
        const edit = new vscode.WorkspaceEdit()

        //insert necessities of a BP in yaml file for increased chances of validation (name, version, formatVersion, inputs, resources)
        edit.insert(newFile, new vscode.Position(0, 0), `name: ${blueprintName}\ninputs: {}\nresources:\n`)

        vscode.window.showInformationMessage(
            "Start editing this file to create your blueprint! " +
                "Once ready, you can push it to vRA with the `Save Blueprint` command."
        )

        const editApplied = await vscode.workspace.applyEdit(edit)
        if (editApplied) {
            vscode.window.showTextDocument(document)
        } else {
            vscode.window.showErrorMessage(`Could not apply changes on ${document.fileName}`)
        }
    }

    private async askForBlueprintName(): Promise<string> {
        const blueprintName = await vscode.window.showInputBox({
            prompt: "Enter a Blueprint name: ",
            placeHolder: "(blueprint name)",
            validateInput: function(value) {
                if (!value || value.trim() == "") {
                    return "The name of the blueprint cannot be empty"
                }

                return "" // it is valid
            }
        })

        if (!blueprintName) {
            return Promise.reject("An empty blueprint name was provided")
        }

        return blueprintName
    }
}
