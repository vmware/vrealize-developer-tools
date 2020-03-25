/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from 'path'
import * as fs from 'fs'

import { AutoWire, Logger, VraNgRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands} from "../constants"
import { Command } from "./Command"
import { ConfigurationManager, EnvironmentManager } from "../system"


@AutoWire
export class UploadBlueprint extends Command<void> {
    private readonly logger = Logger.get("UploadBlueprint")
    private restClient: VraNgRestClient

    get commandId(): string {
        return Commands.UploadBlueprint
    }

    constructor(private env: EnvironmentManager, config: ConfigurationManager) {
        super()
        this.restClient = new VraNgRestClient(config, env)
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

        const activeFilePath = activeTextEditor.document.uri.fsPath
        const blueprintName: vscode.InputBoxOptions = {
            prompt: "Enter name of Blueprint you want to save to vRA: ",
            placeHolder: "(BLUEPRINT NAME)"
        }
        const bpName = await vscode.window.showInputBox(blueprintName)

        const projectName: vscode.InputBoxOptions = {
            prompt: "Enter the name of the VRA Project: ",
            placeHolder: "(PROJECT NAME)"
        }
        const projName: string = (await vscode.window.showInputBox(projectName)) || ""
        const projId = await this.restClient.getProjectId(projName)
        this.logger.info(`UploadBlueprint:execute() Project=${projName} with projId=${projId}`)
        const filePath = path.join(this.env.workspaceFolders[0].uri.path, `${bpName}.yaml`)
        this.logger.info(`UploadBlueprint:execute() filePath = ${filePath}`)
        try {
            if (projId === undefined || bpName === undefined) {
                throw new Error("Missing Input Data")
            }
            fs.exists(filePath, (exist: any) => {
                if (exist) {
                    const content = fs.readFileSync(filePath).toString()
                    this.logger.info(`UploadBlueprint:execute() content = ${content}`)
                    const body = {
                        name: bpName,
                        projectId: projId,
                        content: content
                    }
                    this.restClient.saveBlueprint(body)
                } else {
                    vscode.window.showWarningMessage("Blueprint not found.")
                }
            })
        } catch (err) {
            this.logger.error(`UploadBlueprint:execute() excp=${err.toString()}`)
            return Promise.reject()
        }
    }
}
