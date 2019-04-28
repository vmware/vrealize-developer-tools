/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { ElementKinds, Patterns } from "../../../../constants"
import { AbstractNode } from "../AbstractNode"
import { PackageNode } from "../leaf/PackageNode"

export class PackagesRootNode extends AbstractNode {
    readonly kind: string = ElementKinds.Packages
    readonly name = "Packages"
    readonly id = "vro:packages"
    protected readonly icon = "package"

    constructor(restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(undefined, restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const packages = (await this.restClient.getPackages()).map(originalName => {
            const [qname, version] = originalName.split(Patterns.PackageSplit).filter(val => !!val)
            const pkg = new PackageNode(qname, version, this, this.restClient, this.context)
            return pkg
        })

        return packages
    }

    async asTreeItem(): Promise<vscode.TreeItem> {
        const item = await super.asTreeItem()
        item.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed
        return item
    }
}
