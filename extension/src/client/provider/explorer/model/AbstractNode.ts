/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { PropertyNode } from "./leaf/PropertyNode"

export type IconPath =
    | string
    | vscode.Uri
    | { light: string | vscode.Uri; dark: string | vscode.Uri }
    | vscode.ThemeIcon

export abstract class AbstractNode {
    protected abstract readonly icon: IconPath

    abstract readonly name: string
    abstract readonly id: string
    abstract readonly kind: string

    constructor(
        public readonly parent: AbstractNode | undefined,
        protected readonly restClient: VroRestClient,
        protected readonly context: vscode.ExtensionContext
    ) {}

    async getChildren(): Promise<AbstractNode[]> {
        return []
    }

    async getProperties(): Promise<PropertyNode[]> {
        return []
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = new vscode.TreeItem(this.name)
        item.id = this.id
        item.contextValue = this.kind

        if (typeof this.icon === "string") {
            item.iconPath = {
                light: this.context.asAbsolutePath(`assets/icons/light/${this.icon}.svg`),
                dark: this.context.asAbsolutePath(`assets/icons/dark/${this.icon}.svg`)
            }
        } else {
            item.iconPath = this.icon
        }

        return item
    }
}
