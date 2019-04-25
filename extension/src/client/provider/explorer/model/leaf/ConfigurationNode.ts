/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { AbstractNode } from "../AbstractNode"

export class ConfigurationNode extends AbstractNode {
    protected readonly icon = "configuration"

    constructor(
        readonly id: string,
        readonly name: string,
        restClient: VroRestClient,
        context: vscode.ExtensionContext
    ) {
        super(restClient, context)
    }
}
