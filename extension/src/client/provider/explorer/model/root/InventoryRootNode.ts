/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { InventoryNode } from "../leaf/InventoryNode"
import { ElementKinds } from "../../../../constants"

export class InventoryRootNode extends AbstractNode {
    readonly kind: string = ElementKinds.Inventory
    readonly name: string = "Inventory"
    readonly id: string = "vro:inventory"
    protected readonly icon = "inventory"

    constructor(restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(undefined, restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const inventory = (await this.restClient.getInventoryItems())
            .map(item => {
                return new InventoryNode(
                    item.href,
                    item.name,
                    item.type,
                    item.name, // namespace = plugin name
                    this,
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
