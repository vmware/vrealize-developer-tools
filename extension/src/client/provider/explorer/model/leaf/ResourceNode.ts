/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { PropertyNode } from "./PropertyNode"
import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class ResourceNode extends AbstractNode {
    readonly kind: string = ElementKinds.Resource
    protected readonly icon = "resource"

    constructor(
        public readonly id: string,
        public readonly name: string,
        parent: AbstractNode,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(parent, restClient, context)
    }

    async getProperties(): Promise<PropertyNode[]> {
        const resource = await this.restClient.getResourceInfo(this.id)
        const properties: PropertyNode[] = Object.entries(resource)
            .filter(([key]) => key !== "href" && key !== "relations")
            .map(([key, value]) => this.asPropNode(key, `${value}`, `${value}`))

        return properties
    }

    private asPropNode(name: string, value: string, tooltip?: string): PropertyNode {
        return new PropertyNode(name, value, tooltip, this.restClient, this.context)
    }
}
