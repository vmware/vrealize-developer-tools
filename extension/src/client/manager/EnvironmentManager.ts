/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, BaseEnvironment, Logger, WorkspaceFolder } from "vrealize-common"
import * as vscode from "vscode"

import { extensionShortName } from "../constants"
import { ConfigurationManager } from "./ConfigurationManager"

@AutoWire
export class EnvironmentManager extends BaseEnvironment {
    protected readonly logger = Logger.get("EnvironmentManager")

    get workspaceFolders(): WorkspaceFolder[] {
        return (vscode.workspace.workspaceFolders || []).map(folder => WorkspaceFolder.fromVscode(folder))
    }

    constructor(protected config: ConfigurationManager) {
        super()

        this.logger.debug("Registering the environment manager...")
    }

    get displayName(): string {
        return extensionShortName
    }
}
