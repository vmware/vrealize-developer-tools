/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

export type IconPath =
    | string
    | vscode.Uri
    | { light: string | vscode.Uri; dark: string | vscode.Uri }
    | vscode.ThemeIcon

export abstract class AbstractNode {
    protected readonly context: vscode.ExtensionContext
    protected readonly restClient: VroRestClient
    protected abstract readonly icon: IconPath
    protected abstract readonly name: string
    protected abstract readonly id: string
    protected abstract readonly kind: string

    constructor(restClient: VroRestClient, context: vscode.ExtensionContext) {
        this.restClient = restClient
        this.context = context
    }

    async getChildren(): Promise<AbstractNode[]> {
        return []
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = new vscode.TreeItem(this.name)
        item.id = this.id
        item.contextValue = this.kind;

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
