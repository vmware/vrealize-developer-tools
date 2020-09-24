/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"
import * as _ from "lodash"
import { AutoWire, Logger, PomFile, proc, WorkspaceFolder } from "vrealize-common"
import { FileChangeType } from "vscode-languageserver"

import { Environment, FileChangeEventParams, HintLookup, WorkspaceFilesWatcher } from "../../core"
import { FileSavedEventParams, WorkspaceDocumentWatcher } from "../../core/WorkspaceDocumentWatcher"

@AutoWire
export class WorkspaceCollection {
    private readonly logger = Logger.get("WorkspaceCollection")
    private readonly debounceTriggerCollection = _.debounce(this.triggerCollectionAndRefresh, 10000)

    constructor(
        private environment: Environment,
        private hints: HintLookup,
        workspaceFilesWatcher: WorkspaceFilesWatcher,
        workspaceDidSaveDocumentWatcher: WorkspaceDocumentWatcher
    ) {
        workspaceFilesWatcher.onDidChangeWatchedFiles(this.onWorkspaceFilesChanged.bind(this))
        workspaceDidSaveDocumentWatcher.onDidSaveWatchedFiles(this.onWorkspaceFilesSave.bind(this))
    }

    private async onWorkspaceFilesChanged(event: FileChangeEventParams): Promise<void> {
        for (const change of event.changes) {
            if (!change.workspaceFolder) {
                this.logger.warn("Could not trigger collection. Empty workspace folder in change event.", change)
                continue
            }

            if (change.type === FileChangeType.Created || change.type === FileChangeType.Deleted) {
                this.debounceTriggerCollection(change.workspaceFolder)
            }
        }
    }

    private async onWorkspaceFilesSave(event: FileSavedEventParams): Promise<void> {
        for (const change of event.changes) {
            if (!change.workspaceFolder) {
                this.logger.warn("Could not trigger collection. Empty workspace folder in change event.", change)
                continue
            }

            this.debounceTriggerCollection(change.workspaceFolder)
        }
    }

    private async triggerCollectionAndRefresh(workspaceFolder: WorkspaceFolder): Promise<void> {
        await this.triggerCollection(workspaceFolder)
        this.hints.refreshForWorkspace(workspaceFolder)
    }

    private async triggerCollection(workspaceFolder: WorkspaceFolder): Promise<void> {
        const modules: string[] = []
        const outputDir = this.environment.resolveHintsDir(workspaceFolder)

        this.getModulesForCollection(workspaceFolder, undefined, modules)
        if (modules.length === 0) {
            this.logger.debug("Skipping workspace collection as there are no JS action modules in the project")
            return
        }

        const command = `mvn o11n-hint:collect -DoutputHintDirectory="${outputDir}" -pl ${modules.join(",")} -e`
        const cmdOptions = { cwd: workspaceFolder.uri.fsPath }

        await proc.exec(command, cmdOptions, this.logger)
        this.logger.info("Workspace hint collection has finished")
    }

    private getModulesForCollection(folder: WorkspaceFolder, subfolder: string | undefined, modules: string[]): void {
        const pomFilePath = path.join(folder.uri.fsPath, subfolder || "", "pom.xml")

        if (!fs.existsSync(pomFilePath)) {
            throw new Error(`Missing pom.xml in workspace ${folder.name}${subfolder ? `/${subfolder}` : ""}`)
        }

        const pomFile = new PomFile(pomFilePath)

        if (pomFile.isBase && pomFile.modules.length > 0) {
            pomFile.modules.forEach(module => {
                this.getModulesForCollection(folder, module, modules)
            })
        }

        if (!!subfolder && pomFile.parentId === "com.vmware.pscoe.o11n:actions-package") {
            modules.push(subfolder)
        }
    }
}
