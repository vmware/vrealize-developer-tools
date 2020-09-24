/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"
import * as fs from "fs-extra"

import { PropertyNode } from "./PropertyNode"
import { AbstractNode, IconPath } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class InventoryNode extends AbstractNode {
    readonly kind: string = ElementKinds.InventoryItem
    private readonly iconPath: string

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly type: string,
        public readonly namespace: string,
        parent: AbstractNode,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(parent, restClient, context)

        const storagePath = path.join(context["globalStoragePath"], "inventory-icons", namespace)
        if (!fs.existsSync(storagePath)) {
            fs.mkdirpSync(storagePath)
        }

        this.iconPath = path.join(storagePath, `${type || name}.png`)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const children = await this.restClient.getInventoryItems(this.id)
        const childNodes: InventoryNode[] = []

        for (const child of children) {
            if (child.rel !== "down") {
                continue
            }

            childNodes.push(
                new InventoryNode(
                    child.href,
                    child.name,
                    child.type,
                    this.namespace,
                    this,
                    this.restClient,
                    this.context
                )
            )
        }

        return childNodes
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = new vscode.TreeItem(this.name)
        item.id = this.id
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        item.iconPath = this.icon

        if (!fs.existsSync(this.iconPath)) {
            await this.restClient.fetchIcon(this.namespace, this.type, this.iconPath)
        }

        return item
    }

    async getProperties(): Promise<PropertyNode[]> {
        const config = await this.restClient.getInventoryItem(this.id)
        const [, attributes] = Object.entries(config).find(([key]) => key === "attributes") || [null, []]

        return (attributes as { name: string; value: string }[])
            .filter(att => att.name !== "@type")
            .map(att => this.asPropNode(att.name, att.value))
    }

    protected get icon(): IconPath {
        return this.iconPath
    }

    private asPropNode(name: string, value: string | PropertyNode[], tooltip?: string): PropertyNode {
        return new PropertyNode(name, value, tooltip, this.restClient, this.context)
    }
}
