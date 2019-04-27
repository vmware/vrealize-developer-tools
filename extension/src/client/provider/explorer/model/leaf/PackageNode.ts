/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class PackageNode extends AbstractNode {
    readonly kind: string = ElementKinds.Package
    readonly name: string
    readonly id: string

    protected readonly icon = "package"

    constructor(
        readonly qualifiedName: string,
        readonly version: string | undefined,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(restClient, context)
        this.name = qualifiedName
        this.id = `${qualifiedName}:${version}`
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.description = this.version
        return item
    }
}
