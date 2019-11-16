/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, ElementKinds } from "../constants"
import { Command } from "./Command"
import { ContentLocation } from "../provider/content/ContentLocation"
import { ActionNode, ConfigurationNode, ResourceNode, WorkflowNode } from "../provider/explorer/model"

export class FetchRemoteElement extends Command {
    private readonly logger = Logger.get("FetchRemoteElement")

    get commandId(): string {
        return Commands.FetchRemoteElement
    }

    constructor() {
        super()
    }

    async execute(
        context: vscode.ExtensionContext,
        node: ActionNode | WorkflowNode | ConfigurationNode | ResourceNode
    ): Promise<void> {
        this.logger.info("Executing command Fetch Remote Element")
        let extension = "xml"
        let name = node.name

        if (node.kind == ElementKinds.Action) {
            extension = "js"
        } else if (node.kind == ElementKinds.Resource) {
            [name, extension] = node.name.split(".")
        }

        const url = ContentLocation.with({
            scheme: ContentLocation.VRO_URI_SCHEME,
            type: node.kind.replace("vrdev:element:kind:", ""),
            name: name,
            extension,
            id: node.id
        })

        this.logger.debug(`Opening the selected action: ${url.toString()}`)

        const textDocument = await vscode.workspace.openTextDocument(vscode.Uri.parse(url.toString()))
        await vscode.window.showTextDocument(textDocument, { preview: true })
    }
}
