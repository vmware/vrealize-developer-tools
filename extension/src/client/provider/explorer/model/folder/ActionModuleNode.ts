/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { ActionNode } from "../leaf/ActionNode"
import { CategoryNode } from "./CategoryNode"
import { ElementKinds } from "../../../../constants";

export class ActionModuleNode extends CategoryNode<ActionNode> {
    protected readonly kind: string = ElementKinds.Module

    constructor(
        id: string,
        label: string,
        public fullName: string,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(id, label, "ScriptModuleCategory", ActionNode, restClient, context)
    }
}
