/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, BaseEnvironment, Logger, WorkspaceFolder } from "vrealize-common"
import * as vscode from "vscode"

import { extensionShortName, ProjectArchetypes } from "../constants"
import { ConfigurationManager } from "./ConfigurationManager"
import { Registrable } from "../Registrable"

@AutoWire
export class EnvironmentManager extends BaseEnvironment implements Registrable {
    protected readonly logger = Logger.get("EnvironmentManager")

    context: vscode.ExtensionContext

    get workspaceFolders(): WorkspaceFolder[] {
        return (vscode.workspace.workspaceFolders || []).map(folder => WorkspaceFolder.fromVscode(folder))
    }

    constructor(protected config: ConfigurationManager) {
        super()

        this.logger.debug("Registering the environment manager...")
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the environment manager")
        this.context = context
    }

    get displayName(): string {
        return extensionShortName
    }

    hasRelevantProject(filter?: (folder: WorkspaceFolder) => boolean): boolean {
        const projectTypes = Object.values(ProjectArchetypes) as string[]

        return this.workspaceFolders.some(folder => {
            const isSupportedProjectType = !!folder.projectType && projectTypes.includes(folder.projectType)
            const matchesFilter = !filter || filter(folder)

            return isSupportedProjectType && matchesFilter
        })
    }
}
