/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AbstractWatcher, AutoWire, Logger, WorkspaceFolder } from "vrealize-common"
import { DidChangeWatchedFilesParams, Disposable, FileEvent } from "vscode-languageserver"
import { URI } from "vscode-uri"

import { ConnectionLocator } from "./ConnectionLocator"
import { Environment } from "./Environment"

export interface FileChangeEvent extends FileEvent {
    workspaceFolder: WorkspaceFolder | undefined
}

export interface FileChangeEventParams {
    changes: FileChangeEvent[]
}

export type FileChangeListener = (event: FileChangeEventParams) => void

@AutoWire
export class WorkspaceFilesWatcher extends AbstractWatcher<FileChangeEventParams> {
    protected readonly logger = Logger.get("WorkspaceFilesWatcher")

    constructor(connectionLocator: ConnectionLocator, private environment: Environment) {
        super()
        // pattern for the files to watch is defined in the LanguageClientOptions. See {LangugeServices}
        connectionLocator.connection.onDidChangeWatchedFiles(this.watchedFilesChanged.bind(this))
    }

    onDidChangeWatchedFiles(listener: FileChangeListener): Disposable {
        return this.registerListener(listener)
    }

    private watchedFilesChanged(event: DidChangeWatchedFilesParams): void {
        this.logger.info("Watched workspace files were changed.")
        const newEvent: FileChangeEventParams = {
            changes: event.changes.map(this.convertEvent.bind(this))
        }

        this.logger.debug("Full list of changes (created = type 1, changed = type 2, deleted = type 3): ", newEvent)
        this.notifyListeners(newEvent)
    }

    private convertEvent(event: FileEvent): FileChangeEvent {
        return {
            type: event.type,
            uri: event.uri,
            workspaceFolder: this.environment.getWorkspaceFolderOf(URI.parse(event.uri).fsPath)
        }
    }
}
