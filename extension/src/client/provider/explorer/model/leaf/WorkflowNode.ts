/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"
import { ElementKinds } from "../../../../constants"

export class WorkflowNode extends AbstractNode {
    protected readonly icon = "workflow"
    protected readonly kind: string = ElementKinds.Workflow

    constructor(
        readonly id: string,
        readonly name: string,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(restClient, context)
    }
}
