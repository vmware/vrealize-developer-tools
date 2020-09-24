/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VraNgRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { ConfigurationManager, EnvironmentManager } from "../system"
import { Command } from "./Command"
import { VraIdentityStore } from "../storage"
import { Commands } from "../constants"

export abstract class BaseVraCommand extends Command<void> {
    constructor(
        protected env: EnvironmentManager,
        protected config: ConfigurationManager,
        protected identity: VraIdentityStore
    ) {
        super()
    }

    protected async getRestClient(): Promise<VraNgRestClient> {
        let host = this.config.vrdev.vra.auth.host
        let port = this.config.vrdev.vra.auth.port

        if (!host) {
            await vscode.commands.executeCommand(Commands.ConfigureVraAuth)
        }

        host = this.config.vrdev.vra.auth.host
        port = this.config.vrdev.vra.auth.port

        if (!host) {
            throw new Error("Missing vRA host configuration")
        }

        return new VraNgRestClient(host, port, this.identity)
    }

    protected async askForWorkspace(message: string): Promise<vscode.WorkspaceFolder> {
        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length == 0) {
            return Promise.reject("There are no workspace folders opened in this window")
        } else if (vscode.workspace.workspaceFolders.length == 1) {
            return vscode.workspace.workspaceFolders[0]
        }

        const workspaceFolder = await vscode.window.showWorkspaceFolderPick({
            ignoreFocusOut: true,
            placeHolder: message
        })

        if (!workspaceFolder) {
            return Promise.reject("No workspace selection made")
        }

        return workspaceFolder
    }
}
