/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, Views } from "../../constants"
import { ConfigurationManager, EnvironmentManager } from "../../manager"
import { Registrable } from "../../Registrable"
import {
    AbstractNode,
    ActionsRootNode,
    ConfigurationNode,
    InventoryRootNode,
    PackagesRootNode,
    ResourceNode,
    RootNode,
    WorkflowNode
} from "./model"

@AutoWire
export class ExplorerProvider implements vscode.TreeDataProvider<AbstractNode>, Registrable, vscode.Disposable {
    private readonly logger = Logger.get("ExplorerProvider")

    private onDidChangeTreeDataEmitter: vscode.EventEmitter<AbstractNode> = new vscode.EventEmitter<AbstractNode>()
    private context: vscode.ExtensionContext
    private restClient: VroRestClient
    private rootNodes: AbstractNode[] = []

    readonly onDidChangeTreeData: vscode.Event<AbstractNode> = this.onDidChangeTreeDataEmitter.event

    constructor(environment: EnvironmentManager, private config: ConfigurationManager) {
        this.restClient = new VroRestClient(config, environment)
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the explorer provider")

        this.context = context
        const providerRegistration = vscode.window.registerTreeDataProvider(Views.Explorer, this)
        const refreshCommand = vscode.commands.registerCommand(Commands.RefreshExplorer, () => this.refresh())
        context.subscriptions.push(this, providerRegistration, refreshCommand)
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

    private async getRootNodes(): Promise<AbstractNode[]> {
        this.rootNodes = [
            new RootNode(
                "Workflows",
                "vro:workflows",
                "workflow",
                "WorkflowCategory",
                WorkflowNode,
                this.restClient,
                this.context
            ),

            new ActionsRootNode(this.config, this.restClient, this.context),

            new RootNode(
                "Resources",
                "vro:resources",
                "resource",
                "ResourceElementCategory",
                ResourceNode,
                this.restClient,
                this.context
            ),

            new RootNode(
                "Configurations",
                "vro:configurations",
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
