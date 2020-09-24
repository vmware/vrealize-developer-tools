/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AbstractWatcher, AutoWire, Logger } from "vrealize-common"
import { Disposable, WorkspaceFoldersChangeEvent } from "vscode-languageserver"

import { ConnectionLocator } from "./ConnectionLocator"
import { Initializer } from "./Initializer"

export type WorkspaceChangeListener = (event: WorkspaceFoldersChangeEvent) => void

@AutoWire
export class WorkspaceFoldersWatcher extends AbstractWatcher<WorkspaceFoldersChangeEvent> {
    protected readonly logger = Logger.get("WorkspaceFoldersWatcher")

    constructor(connectionLocator: ConnectionLocator, initializer: Initializer) {
        super()
        initializer.onInitialized(() => {
            connectionLocator.connection.workspace.onDidChangeWorkspaceFolders(this.watchedFilesChanged, this)
        })
    }

    onDidChangeWorkspaceFolders(listener: WorkspaceChangeListener): Disposable {
        return this.registerListener(listener)
    }

    private watchedFilesChanged(event: WorkspaceFoldersChangeEvent): void {
        this.logger.info("The number of opened workspace folders has changed.")
        this.logger.debug("Full list of changes: ", event)

        this.notifyListeners(event)
    }
}
