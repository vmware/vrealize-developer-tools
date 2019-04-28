/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { PropertyNode } from "./PropertyNode"
import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class ConfigurationNode extends AbstractNode {
    readonly kind: string = ElementKinds.Configuraion
    protected readonly icon = "configuration"

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
        const config = await this.restClient.getConfiguration(this.id)
        const properties: PropertyNode[] = Object.entries(config)
            .filter(([key]) => key !== "href" && key !== "relations")
            .map(([key, value]) => {
                if (key !== "attributes") {
                    return this.asPropNode(key, `${value}`)
                }

                const attributes = (value as { name: string; type: string; value: string }[]).map(att =>
                    this.asPropNode(att.name, att.type, att.value)
                )
                return this.asPropNode(key, attributes)
            })

        return properties
    }

    private asPropNode(name: string, value: string | PropertyNode[], tooltip?: string): PropertyNode {
        return new PropertyNode(name, value, tooltip, this.restClient, this.context)
    }
}
