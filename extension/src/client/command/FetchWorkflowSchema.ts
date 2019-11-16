/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"
import * as fs from "fs-extra"

import { Commands } from "../constants"
import { Command } from "./Command"
import { WorkflowNode } from "../provider/explorer/model"
import { ConfigurationManager, EnvironmentManager } from "../manager"

@AutoWire
export class FetchWorkflowSchema extends Command {
    private readonly logger = Logger.get("FetchWorkflowSchema")
    private readonly restClient: VroRestClient

    get commandId(): string {
        return Commands.FetchWorkflowSchema
    }

    constructor(config: ConfigurationManager, environment: EnvironmentManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
    }

    async execute(context: vscode.ExtensionContext, node: WorkflowNode): Promise<void> {
        this.logger.info("Executing command Fetch Workflow Schema")
        const storagePath = path.join(context.extensionPath, "workflow-schema")
        if (!fs.existsSync(storagePath)) {
            fs.mkdirpSync(storagePath)
        }
        const schemaFile = path.join(storagePath, `${node.id}.png`)
        await this.fetchSchema(node, schemaFile)
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined
        const panel = vscode.window.createWebviewPanel(
            "preview-workflow-schema",
            `Workflow Schema: ${node.name}`,
            column || vscode.ViewColumn.One,
            {
                localResourceRoots: [vscode.Uri.file(storagePath)]
            }
        )

        panel.onDidDispose(() => {
            fs.removeSync(schemaFile)
        })

        panel.webview.html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="img-src vscode-resource:;">
                <title>Workflow Schema: ${node.name}</title>
            </head>
            <body style="background-color:white;">
                <img src="${vscode.Uri.file(schemaFile).with({ scheme: "vscode-resource" })}" />
            </body>
            </html>`

        panel.reveal()
    }

    private fetchSchema(node: WorkflowNode, schemaFile: string): Thenable<void> {
        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Window
            },
            progress => {
                return new Promise(async (resolve, reject) => {
                    this.logger.info(`Fetching schema: ${node.id}`)
                    progress.report({ message: `Fetching schema for ${node.name}...` })

                    try {
                        await this.restClient.fetchWorkflowSchema(node.id, schemaFile)
                        resolve()
                    } catch (err) {
                        this.logger.error(`Failed schema for '${node.name} (${node.id})'. Error: `, err)
                        reject(err)

                        vscode.window.showErrorMessage(
                            `Failed fetching schema (${err.code}). See logs for more information.`
                        )
                    }
                })
            }
        )
    }
}
