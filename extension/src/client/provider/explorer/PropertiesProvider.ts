/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, Views } from "../../constants"
import { ConfigurationManager, EnvironmentManager } from "../../manager"
import { Registrable } from "../../Registrable"
import { AbstractNode } from "./model"
import { PropertyNode } from "./model/leaf/PropertyNode"

@AutoWire
export class PropertiesProvider implements vscode.TreeDataProvider<AbstractNode>, Registrable, vscode.Disposable {
    private readonly logger = Logger.get("PropertiesProvider")

    private onDidChangeTreeDataEmitter: vscode.EventEmitter<AbstractNode> = new vscode.EventEmitter<AbstractNode>()
    private context: vscode.ExtensionContext
    private restClient: VroRestClient
    private rootNode: AbstractNode
    private tree: vscode.TreeView<AbstractNode>

    readonly onDidChangeTreeData: vscode.Event<AbstractNode> = this.onDidChangeTreeDataEmitter.event

    constructor(environment: EnvironmentManager, private config: ConfigurationManager) {
        this.restClient = new VroRestClient(config, environment)
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the properties provider")

        this.context = context
        this.tree = vscode.window.createTreeView(Views.Properties, {
            showCollapseAll: true,
            treeDataProvider: this
        })

        const showProperties = vscode.commands.registerCommand(Commands.ShowItemProperties, (node: AbstractNode) =>
            this.refresh(node)
        )
        const copyValue = vscode.commands.registerCommand(Commands.CopyPropertyValue, (node: AbstractNode) => {
            if (!!node && node instanceof PropertyNode && typeof node.value === "string") {
                vscode.env.clipboard.writeText(node.value)
            }
        })
        context.subscriptions.push(this, this.tree, showProperties, copyValue)
    }

    dispose() {
        // empty
    }

    refresh(node: AbstractNode): void {
        this.rootNode = node
        this.onDidChangeTreeDataEmitter.fire()
        this.restClient
        this.context
        this.config
    }

    async getTreeItem(element: AbstractNode): Promise<vscode.TreeItem> {
        return await element.asTreeItem()
    }

    async getChildren(element?: AbstractNode): Promise<AbstractNode[]> {
        if (!element) {
            return this.rootNode ? this.rootNode.getProperties() : []
        }

        return element.getChildren()
    }
}
