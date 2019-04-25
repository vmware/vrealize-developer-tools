/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { InventoryNode } from "../leaf/InventoryNode"

export class InventoryRootNode extends AbstractNode {
    protected readonly icon = "inventory"
    protected readonly name: string
    protected readonly id: string

    constructor(restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(restClient, context)

        this.name = "Inventory"
        this.id = "vro:inventory"
    }

    async getChildren(): Promise<AbstractNode[]> {
        const inventory = (await this.restClient.getInventoryItems())
            .map(item => {
                return new InventoryNode(
                    item.href,
                    item.name,
                    item.type,
                    item.name, // namespace = plugin name
                    this.restClient,
                    this.context
                )
            })
            .filter(node => {
                return node.name !== "System"
            })

        return inventory
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
