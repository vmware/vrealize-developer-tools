/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class PropertyNode extends AbstractNode {
    readonly kind: string = ElementKinds.Property
    protected readonly icon = "property"
    readonly id: string

    constructor(
        public readonly name: string,
        public readonly value: string | AbstractNode[],
        public readonly tooltip: string | undefined,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(undefined, restClient, context)
        this.id = `${name}:${value}`

        if (typeof value !== "string") {
            this.kind = `${this.kind}+multi`
        }
    }

    async getChildren(): Promise<AbstractNode[]> {
        if (!this.value || typeof this.value === "string") {
            return []
        }

        return this.value
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.tooltip = this.tooltip || (typeof this.value === "string" ? this.value : undefined)
        if (typeof this.value === "string") {
            item.description = this.value
            item.collapsibleState = vscode.TreeItemCollapsibleState.None
        } else {
            item.description = `${this.value.length} items`
            item.collapsibleState = vscode.TreeItemCollapsibleState.Expanded
        }

        return item
    }
}
