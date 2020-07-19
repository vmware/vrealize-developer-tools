/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { BuiltInCommands, CommandContext, Commands, Views } from "../../constants"
import { Registrable } from "../../Registrable"
import { AbstractNode } from "./model"
import { PropertyNode } from "./model/leaf/PropertyNode"

@AutoWire
export class PropertiesProvider implements vscode.TreeDataProvider<AbstractNode>, Registrable, vscode.Disposable {
    private readonly logger = Logger.get("PropertiesProvider")

    private onDidChangeTreeDataEmitter: vscode.EventEmitter<AbstractNode> = new vscode.EventEmitter<AbstractNode>()
    private rootNode: AbstractNode
    private tree: vscode.TreeView<AbstractNode>

    readonly onDidChangeTreeData: vscode.Event<AbstractNode> = this.onDidChangeTreeDataEmitter.event

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the properties provider")

        this.tree = vscode.window.createTreeView(Views.Properties, {
            showCollapseAll: true,
            treeDataProvider: this
        })
        vscode.commands.executeCommand(BuiltInCommands.SetContext, CommandContext.EmptyProperties, true)

        const showProperties = vscode.commands.registerCommand(Commands.ShowItemProperties, (node: AbstractNode) =>
            this.refresh(node)
        )
        const locateItem = vscode.commands.registerCommand(Commands.LocateItemByProperties, () =>
            vscode.commands.executeCommand(Commands.RevealItemInExplorer, this.rootNode)
        )
        const copyValue = vscode.commands.registerCommand(Commands.CopyPropertyValue, (node: AbstractNode) => {
            if (!!node && node instanceof PropertyNode && typeof node.value === "string") {
                vscode.env.clipboard.writeText(node.value)
            }
        })

        context.subscriptions.push(this, this.tree, showProperties, locateItem, copyValue)
    }

    dispose() {
        // empty
    }

    refresh(node: AbstractNode): void {
        this.rootNode = node
        this.onDidChangeTreeDataEmitter.fire()
    }

    getTreeItem(element: AbstractNode): Promise<vscode.TreeItem> {
        return element.asTreeItem()
    }

    async getChildren(element?: AbstractNode): Promise<AbstractNode[] | undefined> {
        if (!element) {
            if (!this.rootNode) {
                return undefined // show Welcome view
            }

            const properties = this.rootNode ? await this.rootNode.getProperties() : []
            vscode.commands.executeCommand(
                BuiltInCommands.SetContext,
                "vrdev:properties:empty",
                properties.length === 0
            )
            return properties
        }

        return element.getChildren()
    }
}
