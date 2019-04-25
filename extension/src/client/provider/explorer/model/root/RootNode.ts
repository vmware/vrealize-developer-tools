/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { ApiCategoryType, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { CategoryNode } from "../folder/CategoryNode"

export type ChildConstructor<T> = new (
    id: string,
    name: string,
    restClient: VroRestClient,
    context: vscode.ExtensionContext
) => T

export class RootNode<T extends AbstractNode> extends AbstractNode {
    constructor(
        readonly name: string,
        readonly id: string,
        protected readonly icon: string,
        private categoryElementType: ApiCategoryType,
        private childConstructor: ChildConstructor<T>,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const categories = (await this.restClient.getRootCategories(this.categoryElementType)).map(category => {
            return new CategoryNode(
                category.id,
                category.name,
                this.categoryElementType,
                this.childConstructor,
                this.restClient,
                this.context
            )
        })

        return categories
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
