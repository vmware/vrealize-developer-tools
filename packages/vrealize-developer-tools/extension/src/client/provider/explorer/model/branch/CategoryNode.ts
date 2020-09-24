/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { ApiCategoryType, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { ChildConstructor } from "../root/CategoriesRootNode"
import { ElementKinds } from "../../../../constants"

export class CategoryNode<T extends AbstractNode> extends AbstractNode {
    readonly kind: string = ElementKinds.Category
    protected readonly icon = vscode.ThemeIcon.Folder

    constructor(
        public readonly id: string,
        public readonly name: string,
        private categoryElementType: ApiCategoryType,
        private childConstructor: ChildConstructor<T>,
        parent: AbstractNode,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(parent, restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const children = await this.restClient.getChildrenOfCategory(this.id)
        const categories: CategoryNode<T>[] = []
        const elements: AbstractNode[] = []

        for (const child of children) {
            if (child.rel !== "down") {
                continue
            }

            if (child.type === this.categoryElementType) {
                categories.push(
                    new CategoryNode(
                        child.id,
                        child.name,
                        this.categoryElementType,
                        this.childConstructor,
                        this,
                        this.restClient,
                        this.context
                    )
                )
            } else {
                elements.push(new this.childConstructor(child.id, child.name, this, this.restClient, this.context))
            }
        }

        return [...categories, ...elements]
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
