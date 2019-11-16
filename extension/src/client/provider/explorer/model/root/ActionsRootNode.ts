/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { makeHierarchical, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { ConfigurationManager } from "../../../../manager"
import { ElementKinds } from "../../../../constants"
import { AbstractNode } from "../AbstractNode"
import { ActionModuleNode } from "../branch/ActionModuleNode"

export class ActionsRootNode extends AbstractNode {
    readonly kind: string = ElementKinds.Actions
    readonly name = "Actions"
    readonly id = "vro:actions"
    protected readonly icon = "action"

    constructor(private config: ConfigurationManager, restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(undefined, restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const layout = this.config.vrdev.views.explorer.actions.layout
        const categories = await this.restClient.getRootCategories("ScriptModuleCategory")

        if (layout === "flat") {
            return categories.map(category => {
                return new ActionModuleNode(
                    { path: category.name, name: category.name, value: category },
                    this,
                    this.restClient,
                    this.context
                )
            })
        }

        const hierarchy = makeHierarchical(
            categories,
            category => category.name.split("."),
            (...paths: string[]) => paths.join("."),
            () => true,
            layout === "compact"
        )

        const rootFolder = await new ActionModuleNode(hierarchy, this, this.restClient, this.context)
        return rootFolder.getChildren()
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
