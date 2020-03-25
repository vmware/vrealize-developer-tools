/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractBlueprintCommand } from "./AbstractBlueprintCommand"
import { Commands } from "../constants"
import { EnvironmentManager } from "../system"

@AutoWire
export class CreateBlueprint extends AbstractBlueprintCommand {
    private readonly logger = Logger.get("CreateBlueprint")

    get commandId(): string {
        return Commands.CreateBlueprint
    }

    constructor(env: EnvironmentManager) {
        super(env)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command CreateBlueprint")

        if (this.env.workspaceFolders.length == 0) {
            this.logger.error("CreateBlueprint:execute() No opened workspace folders")
            return Promise.reject("There are no workspace folders opened in this window")
        }

        const workspaceFolder = await this.askForWorkspace()
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
}
