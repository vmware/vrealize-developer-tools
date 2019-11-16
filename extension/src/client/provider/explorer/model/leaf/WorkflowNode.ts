/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { PropertyNode } from "./PropertyNode"
import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class WorkflowNode extends AbstractNode {
    readonly kind: string = ElementKinds.Workflow
    protected readonly icon = "workflow"

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
        const workflow = await this.restClient.getWorkflow(this.id)
        const properties: PropertyNode[] = Object.entries(workflow)
            .filter(([key]) => key !== "href" && key !== "relations" && key !== "customized-icon")
            .map(([key, value]) => {
                if (key !== "input-parameters" && key !== "output-parameters") {
                    return this.asPropNode(key, `${value}`)
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
