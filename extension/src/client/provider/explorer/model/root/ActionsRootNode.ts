/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { makeHierarchical, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { ConfigurationManager } from "../../../../manager"
import { ElementKinds } from "../../../../constants"
import { AbstractNode } from "../AbstractNode"
import { ActionModuleNode } from "../folder/ActionModuleNode"
import { FolderNode } from "../folder/FolderNode"

export class ActionsRootNode extends AbstractNode {
    readonly kind: string = ElementKinds.Actions
    readonly name = "Actions"
    readonly id = "vro:actions"
    protected readonly icon = "action"

    constructor(private config: ConfigurationManager, restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const layout = this.config.vrdev.views.explorer.actions.layout
        const categories = (await this.restClient.getRootCategories("ScriptModuleCategory")).map(category => {
            return new ActionModuleNode(
                category.id,
                layout === "flat" ? category.name : category.name.split(".").pop() || "",
                category.name,
                this.restClient,
                this.context
            )
        })

        if (layout === "flat") {
            return categories
        }

        const hierarchy = makeHierarchical(
            categories,
            category => category.fullName.split("."),
            (...paths: string[]) => paths.join("."),
            layout === "compact"
        )

        const rootFolder = await new FolderNode(hierarchy, this.restClient, this.context)
        return rootFolder.getChildren()
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
