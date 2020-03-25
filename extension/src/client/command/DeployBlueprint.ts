/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from 'path'
import * as fs from 'fs'

import { AutoWire, Logger, VraNgRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands} from "../constants"
import { AbstractBlueprintCommand } from "./AbstractBlueprintCommand"
import { ConfigurationManager, EnvironmentManager } from "../system"



@AutoWire
export class DeployBlueprint extends AbstractBlueprintCommand {
    private readonly logger = Logger.get("DeployBlueprint")
    private restClient: VraNgRestClient

    get commandId(): string {
        return Commands.DeployBlueprint
    }

    constructor(env: EnvironmentManager, config: ConfigurationManager) {
        super(env)
        this.restClient = new VraNgRestClient(config, env)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command DeployBlueprint")

        const workspaceFolder = await this.askForWorkspace()

        const blueprintName: vscode.InputBoxOptions = {
            prompt: "Enter the name of the blueprint you want to deploy: ",
            placeHolder: "(BLUEPRINT NAME)"
        }
        const bpName = await vscode.window.showInputBox(blueprintName)

        const projectName: vscode.InputBoxOptions = {
            prompt: "Enter the name of the VRA Project: ",
            placeHolder: "(PROJECT NAME)"
        }
        const projName: string = (await vscode.window.showInputBox(projectName)) || ""
        const projId: string = await this.restClient.getProjectId(projName)

        this.logger.info(`DeployBlueprint:exec() BP name =${bpName} in project=${projName} with projId=${projId}`)
        //check to see if BP name they entered exists as a file already
        const filePath = path.join(this.env.workspaceFolders[0].uri.path, `${bpName}.yaml`)
        this.logger.info(`DeployBlueprint:exec() filePath = ${filePath}`)
        fs.exists(filePath, (exist: any) => {
            if (exist) {
                const content = fs.readFileSync(filePath).toString()
                this.logger.info(`DeployBlueprint:exec() content = ${content}`)
                const body = {
                    deploymentName: `${bpName}Deploy`,
                    projectId: projId,
                    content: content,
                    plan: false
                }
                this.restClient.deployBlueprint(body)
            } else {
                vscode.window.showWarningMessage("Blueprint not found.")
            }
        })
    } //execute
}
