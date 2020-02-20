/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VraNGRestClient } from "vrealize-common"
import * as vscode from "vscode"
import * as path from 'path'
import * as fs from 'fs'
import { Commands} from "../constants"
import { Command } from "./Command"
import { ConfigurationManager, EnvironmentManager } from "../system"



@AutoWire
export class DeployBluePrint extends Command {
    private readonly logger = Logger.get("DeployBluePrint")
    private restClient: VraNGRestClient
    private env: EnvironmentManager

    get commandId(): string {
        return Commands.DeployBluePrint
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VraNGRestClient(config, environment)
        this.env = environment
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command DeployBluePrint")
        let blueprintName: vscode.InputBoxOptions = {
			prompt: "Enter the name of the blueprint you want to deploy: ",
			placeHolder: "(BLUEPRINT NAME)",
        };  
        var bpName = await vscode.window.showInputBox(blueprintName)

        let projectName: vscode.InputBoxOptions = {
			prompt: "Enter the name of the VRA Project: ",
			placeHolder: "(PROJECT NAME)",
        }
        let projName: string = await vscode.window.showInputBox(projectName) || ""
        var projId: string = await this.restClient.getProjectId(projName)

        this.logger.info(`DeployBluePrint:exec() BP name =${bpName} in project=${projName} with projId=${projId}`)
        //check to see if BP name they entered exists as a file already
        let filePath = path.join(this.env.workspaceFolders[0].uri.path, bpName + '.yaml')
        this.logger.info(`DeployBluePrint:exec() filePath = ${filePath}`);
        fs.exists(filePath, (exist:any) => {
            if (exist) {
                const content = fs.readFileSync(filePath).toString();
                this.logger.info(`DeployBluePrint:exec() content = ${content}`)
                const body = {
                    "deploymentName": bpName+"Deploy",
                    "projectId": projId,
                    "content": content,
                    "plan": false
                }
                this.restClient.deployBlueprint(body)
            } else {
                vscode.window.showWarningMessage("Blueprint not found.")
            }
        })
    } //execute
  
}
