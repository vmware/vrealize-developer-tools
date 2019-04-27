/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { HierarchicalNode, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class FolderNode<T extends AbstractNode> extends AbstractNode {
    protected readonly icon = vscode.ThemeIcon.Folder
    protected readonly kind: string = ElementKinds.Folder

    constructor(private node: HierarchicalNode<T>, restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(restClient, context)
    }

    get name(): string {
        return this.node.name
    }

    get id(): string {
        return this.node.path
    }

    async getChildren(): Promise<AbstractNode[]> {
        if (this.node.children === undefined) {
            return []
        }

        const children: (FolderNode<T> | T)[] = []
        for (const node of Object.values(this.node.children)) {
            if (node.value === undefined) {
                // node is container
                children.push(new FolderNode(node, this.restClient, this.context))
                continue
            }

            children.push(node.value)
        }

        return children
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
