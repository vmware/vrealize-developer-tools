/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"
import { HierarchicalNode, VroRestClient } from "vrealize-common"

import { ActionNode } from "../leaf/ActionNode"
import { ElementKinds } from "../../../../constants"
import { AbstractNode } from "../AbstractNode"

interface ModuleInfo {
    id: string
    name: string
}

export class ActionModuleNode extends AbstractNode {
    readonly kind: string = ElementKinds.Module
    protected readonly icon = vscode.ThemeIcon.Folder

    constructor(
        private node: HierarchicalNode<ModuleInfo>,
        parent: AbstractNode,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(parent, restClient, context)
    }

    get name(): string {
        return this.node.name
    }

    get id(): string {
        return this.node.value ? this.node.value.id : this.node.path
    }

    async getChildren(): Promise<AbstractNode[]> {
        const children: (ActionModuleNode | ActionNode)[] = [
            ...this.getModuleChildren(),
            ...(await this.getActionChildren())
        ]

        return children
    }

    getModuleChildren(): ActionModuleNode[] {
        if (!this.node.children) {
            return []
        }

        const children = []
        for (const node of this.node.children.values()) {
            children.push(new ActionModuleNode(node, this, this.restClient, this.context))
        }

        return children
    }

    async getActionChildren(): Promise<ActionNode[]> {
        if (!this.node.value) {
            // node is container (not the last part of an action module)
            return []
        }

        const children = await this.restClient.getChildrenOfCategory(this.id)
        const elements: ActionNode[] = []

        for (const child of children) {
            if (child.rel !== "down") {
                continue
            }

            if (child.type === "ScriptModule") {
                elements.push(new ActionNode(child.id, child.name, this, this.restClient, this.context))
            }
        }

        return elements
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
