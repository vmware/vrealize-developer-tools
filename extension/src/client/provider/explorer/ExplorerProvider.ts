/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, ElementKinds, Views } from "../../constants"
import { ConfigurationManager, EnvironmentManager } from "../../manager"
import { Registrable } from "../../Registrable"
import {
    AbstractNode,
    ActionsRootNode,
    CategoriesRootNode,
    ConfigurationNode,
    InventoryRootNode,
    PackagesRootNode,
    ResourceNode,
    WorkflowNode
} from "./model"

@AutoWire
export class ExplorerProvider implements vscode.TreeDataProvider<AbstractNode>, Registrable, vscode.Disposable {
    private readonly logger = Logger.get("ExplorerProvider")

    private onDidChangeTreeDataEmitter: vscode.EventEmitter<AbstractNode> = new vscode.EventEmitter<AbstractNode>()
    private context: vscode.ExtensionContext
    private restClient: VroRestClient
    private rootNodes: AbstractNode[] = []
    private tree: vscode.TreeView<AbstractNode>

    readonly onDidChangeTreeData: vscode.Event<AbstractNode> = this.onDidChangeTreeDataEmitter.event

    constructor(environment: EnvironmentManager, private config: ConfigurationManager) {
        this.restClient = new VroRestClient(config, environment)
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the explorer provider")

        this.context = context
        this.tree = vscode.window.createTreeView(Views.Explorer, {
            showCollapseAll: true,
            treeDataProvider: this
        })

        const refreshCommand = vscode.commands.registerCommand(Commands.RefreshExplorer, () => this.refresh())
        const onDidChangeSelection = this.tree.onDidChangeSelection(e => this.onDidChangeSelection(e))
        context.subscriptions.push(this, this.tree, refreshCommand, onDidChangeSelection)
    }

    dispose() {
        // empty
    }

    refresh(): void {
        // TODO: refresh on `vrdev.views.explorer.*` configuration change
        this.rootNodes.forEach(node => this.onDidChangeTreeDataEmitter.fire(node))
    }

    async getTreeItem(element: AbstractNode): Promise<vscode.TreeItem> {
        return await element.asTreeItem()
    }

    async getChildren(element?: AbstractNode): Promise<AbstractNode[]> {
        if (!element) {
            return this.getRootNodes()
        }
        return element.getChildren()
    }

    private onDidChangeSelection(event: vscode.TreeViewSelectionChangeEvent<AbstractNode>): void {
        const node = event.selection.length > 0 ? event.selection[0] : undefined

        if (!node) {
            return
        }

        if (
            node.kind === ElementKinds.Action ||
            node.kind === ElementKinds.Workflow ||
            node.kind === ElementKinds.Configuraion ||
            node.kind === ElementKinds.Resource ||
            node.kind === ElementKinds.InventoryItem
        ) {
            vscode.commands.executeCommand(Commands.ShowItemProperties, node)
        }
    }

    private async getRootNodes(): Promise<AbstractNode[]> {
        this.rootNodes = [
            new CategoriesRootNode(
                "Workflows",
                "vro:workflows",
                ElementKinds.Workflows,
                "workflow",
                "WorkflowCategory",
                WorkflowNode,
                this.restClient,
                this.context
            ),

            new ActionsRootNode(this.config, this.restClient, this.context),

            new CategoriesRootNode(
                "Resources",
                "vro:resources",
                ElementKinds.Resources,
                "resource",
                "ResourceElementCategory",
                ResourceNode,
                this.restClient,
                this.context
            ),

            new CategoriesRootNode(
                "Configurations",
                "vro:configurations",
                ElementKinds.Configuraions,
                "configuration",
                "ConfigurationElementCategory",
                ConfigurationNode,
                this.restClient,
                this.context
            ),

            new PackagesRootNode(this.restClient, this.context),
            new InventoryRootNode(this.restClient, this.context)
        ]

        return this.rootNodes
    }
}