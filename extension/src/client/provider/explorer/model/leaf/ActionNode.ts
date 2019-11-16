/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { PropertyNode } from "./PropertyNode"
import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class ActionNode extends AbstractNode {
    readonly kind: string = ElementKinds.Action
    protected readonly icon = "action"

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
        const action = await this.restClient.getAction(this.id)
        const properties: PropertyNode[] = Object.entries(action)
            .filter(([key]) => key !== "href" && key !== "relations")
            .map(([key, value]) => {
                if (key !== "input-parameters") {
                    return this.asPropNode(key, `${value}`, `${value}`)
                }

                const params = (value as { name: string; type: string; description: string }[]).map(prop =>
                    this.asPropNode(prop.name, prop.type, prop.description)
                )
                return this.asPropNode(key, params)
            })

        return properties
    }

    private asPropNode(name: string, value: string | PropertyNode[], tooltip?: string): PropertyNode {
        return new PropertyNode(name, value, tooltip, this.restClient, this.context)
    }
}
