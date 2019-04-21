/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, BaseEnvironment, Logger, WorkspaceFolder } from "vrealize-common"
import { InitializeParams } from "vscode-languageclient"

import { Initializer } from "./Initializer"
import { Settings } from "./Settings"

@AutoWire
export class Environment extends BaseEnvironment {
    protected readonly logger = Logger.get("Environment")

    workspaceFolders: WorkspaceFolder[] = []

    constructor(protected config: Settings, initializer: Initializer) {
        super()

        initializer.onInitialize(this.initialize.bind(this))
        this.logger.debug("Created LS environment")
    }

    private initialize(event: InitializeParams): void {
        if (event.workspaceFolders) {
            this.workspaceFolders = event.workspaceFolders.map(e => WorkspaceFolder.fromProtocol(e))
        }
    }
}
