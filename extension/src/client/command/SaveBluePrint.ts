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
export class SaveBluePrint extends Command {
    private readonly logger = Logger.get("SaveBluePrint")
    private restClient: VraNGRestClient
    private conf: ConfigurationManager
    private env: EnvironmentManager

    get commandId(): string {
        return Commands.SaveBluePrint
    }

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VraNGRestClient(config, environment)
        this.conf = config
        this.env = environment
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command SaveBluePrint" + this.conf.vrdev.auth.profile); 
        
        let blueprintName: vscode.InputBoxOptions = {
			prompt: "Enter name of Blueprint you want to save to vRA: ",
			placeHolder: "(BLUEPRINT NAME)"
        }
        var bpName = await vscode.window.showInputBox(blueprintName)

        let projectName: vscode.InputBoxOptions = {
			prompt: "Enter the name of the VRA Project: ",
			placeHolder: "(PROJECT NAME)",
        }
        let projName: string = await vscode.window.showInputBox(projectName) || ""
        var projId = await this.restClient.getProjectId(projName)
        this.logger.info(`saveBluePrint:execute() Project=${projName} with projId=${projId}`)
        let filePath = path.join(this.env.workspaceFolders[0].uri.path, bpName + '.yaml')
        this.logger.info(`saveBluePrint:execute() filePath = ${filePath}`);
        try {
            if(projId === undefined || bpName === undefined) {
                throw new Error("Missing Input Data")
            }
            fs.exists(filePath, (exist:any) => {
                if (exist) {
                    let content = fs.readFileSync(filePath).toString();
                    this.logger.info(`saveBluePrint:execute() content = ${content}`)  
                    const body = {
                        "name": bpName,
                        "projectId": projId,
                        "content": content
                    }
                    this.restClient.saveBlueprint(body)
                } 
                else {
                    vscode.window.showWarningMessage("Blueprint not found.")
                }
            })
        }
        catch(err){
            this.logger.error(`saveBlueprint:execute() excp=${err.toString()}`)
            return Promise.reject()
        }
    } //execute
}
