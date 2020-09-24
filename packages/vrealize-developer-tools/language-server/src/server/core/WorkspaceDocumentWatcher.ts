/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AbstractWatcher, AutoWire, ChangeListener, Logger, WorkspaceFolder } from "vrealize-common"
import { DidSaveTextDocumentParams, Disposable, FileChangeType, FileEvent } from "vscode-languageserver"
import { URI } from "vscode-uri"

import { ConnectionLocator } from "./ConnectionLocator"
import { Environment } from "./Environment"

export interface FileSavedEvent extends FileEvent {
    workspaceFolder: WorkspaceFolder | undefined
    text: string | undefined
}

export interface FileSavedEventParams {
    changes: FileSavedEvent[]
}

export type FileChangeListener = (event: FileSavedEventParams) => void

@AutoWire
export class WorkspaceDocumentWatcher extends AbstractWatcher<FileSavedEventParams> {
    protected readonly logger = Logger.get("WorkspaceDidSaveDocumentWatcher")

    constructor(connectionLocator: ConnectionLocator, private environment: Environment) {
        super()
        // pattern for the files to watch is defined in the LanguageClientOptions. See {LangugeServices}
        connectionLocator.connection.onDidSaveTextDocument(this.watchedFilesSaved.bind(this))
    }

    onDidSaveWatchedFiles(listener: ChangeListener<FileSavedEventParams>): Disposable {
        return this.registerListener(listener)
    }

    private watchedFilesSaved(event: DidSaveTextDocumentParams): void {
        this.logger.info("Watched workspace files were saved.")
        const newEvent: FileSavedEventParams = {
            changes: [this.convertEvent(event)]
        }

        this.notifyListeners(newEvent)
    }

    private convertEvent(event: DidSaveTextDocumentParams): FileSavedEvent {
        return {
            uri: event.textDocument.uri,
            type: FileChangeType.Changed,
            text: event.text,
            workspaceFolder: this.environment.getWorkspaceFolderOf(URI.parse(event.textDocument.uri).fsPath)
        }
    }
}
