/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"

import { Command } from "./Command"
import { EnvironmentManager } from "../system"

export abstract class AbstractBlueprintCommand extends Command {
    protected NAME_INPUT_OPTIONS: vscode.InputBoxOptions = {
        prompt: "Enter a Blueprint name: ",
        placeHolder: "(BLUEPRINT NAME)",
        validateInput: function(value) {
            if (!value) {
                return "The name of the blueprint cannot be empty"
            }

            return "" // it is valid
        }
    }

    protected WORKSPACE_INPUT_OPTIONS: vscode.WorkspaceFolderPickOptions = {
        ignoreFocusOut: true,
        placeHolder: "Select the workspace where a new blueprint will be created"
    }

    constructor(protected env: EnvironmentManager) {
        super()
    }

    protected async askForWorkspace(): Promise<vscode.WorkspaceFolder> {
        if (this.env.workspaceFolders.length == 0) {
            return Promise.reject("There are no workspace folders opened in this window")
        }

        const workspaceFolder = await vscode.window.showWorkspaceFolderPick(this.WORKSPACE_INPUT_OPTIONS)
        if (!workspaceFolder) {
            return Promise.reject("No workspace selection made")
        }

        return workspaceFolder
    }

    protected async askForBlueprintName(): Promise<string> {
        const blueprintName = await vscode.window.showInputBox(this.NAME_INPUT_OPTIONS)
        if (!blueprintName) {
            return Promise.reject("An empty blueprint name was provided")
        }

        return blueprintName
    }
}
