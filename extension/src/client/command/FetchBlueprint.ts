/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VraNgRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { Command } from "./Command"
import { ConfigurationManager, EnvironmentManager } from "../system"
//import * as path from "path"


@AutoWire
export class GetBlueprint extends Command<void> {
    private readonly logger = Logger.get("FetchBlueprint")
    private restClient: VraNgRestClient
    private conf: ConfigurationManager
    private envMgr: EnvironmentManager

    get commandId(): string {
        return Commands.FetchBlueprint
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VraNgRestClient(config, environment)
        this.conf = config
        this.envMgr = environment
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        const blueprintNameToGet: vscode.InputBoxOptions = {
            prompt: "Enter the name or ID of the blueprint you want to get: ",
            placeHolder: "(BLUEPRINT NAME/ID)"
        }

        const bpName = await vscode.window.showInputBox(blueprintNameToGet)
        const baseUrl = `https://${this.conf.vrdev.auth.host}`
        this.logger.info(
            `Executing command FetchBlueprint, authProfile=${this.conf.vrdev.auth.profile} domain=${this.conf.vrdev.auth.domain}`
        )

        // get access token first
        const accessToken = await this.restClient.getAccessToken()
        this.logger.info(`GetBlueprint: execute() Got AccessToken ${accessToken}`)

        // Now after we have valid access token, lets get the Blueprints for a given Name
        let bpUrl = `${baseUrl}/blueprint/api/blueprints?name=${bpName}`
        const id = await this.restClient.getBlueprintByName(bpUrl, accessToken)
        this.logger.info(`GetBlueprint: execute() blueprintID = ${id}`)

        // At this point we have a blueprintId, lets fetch Blueprint content into a file
        bpUrl = `${baseUrl}/blueprint/api/blueprints/${id}`

        const filePath = `${this.envMgr.workspaceFolders[0].uri.path}/${bpName}.yaml`
        return this.restClient.getBlueprintById(bpUrl, filePath, accessToken)
    } //execute
}
