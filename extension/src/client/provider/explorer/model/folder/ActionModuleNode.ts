/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { ActionNode } from "../leaf/ActionNode"
import { CategoryNode } from "./CategoryNode"
import { ElementKinds } from "../../../../constants"
import { AbstractNode } from "../AbstractNode"

export class ActionModuleNode extends CategoryNode<ActionNode> {
    readonly kind: string = ElementKinds.Module

    constructor(
        id: string,
        label: string,
        public fullName: string,
        parent: AbstractNode,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(id, label, "ScriptModuleCategory", ActionNode, parent, restClient, context)
    }
}
