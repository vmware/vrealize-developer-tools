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
    protected readonly icon = "package"
    protected readonly name = "Packages"
    protected readonly id = "vro:packages"
    protected readonly kind: string = ElementKinds.Packages

    constructor(restClient: VroRestClient, context: vscode.ExtensionContext) {
        super(restClient, context)
    }

    async getChildren(): Promise<AbstractNode[]> {
        const packages = (await this.restClient.getPackages()).map(originalName => {
            const [qname, version] = originalName.split(Patterns.PackageSplit).filter(val => !!val)
            const pkg = new PackageNode(qname, version, this.restClient, this.context)
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
