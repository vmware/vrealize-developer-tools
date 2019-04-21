/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import { TextDocument, TextDocumentContentChangeEvent, VersionedTextDocumentIdentifier } from "vscode-languageserver"

import { ConnectionLocator } from "../core"
import { TextDocumentWrapper } from "./TextDocumentWrapper"


@AutoWire
export class Synchronizer {
    private readonly logger = Logger.get("Synchronizer")

    private textDocuments: Map<string, TextDocumentWrapper> = new Map()

    constructor(connectionLocator: ConnectionLocator) {
        connectionLocator.connection.onDidCloseTextDocument(event => {
            this.logger.debug(`Document ${event.textDocument.uri} was closed. Removing it from the store.`)
            this.textDocuments.delete(event.textDocument.uri)
        })

        connectionLocator.connection.onDidOpenTextDocument(
            async (event): Promise<void> => {
                this.logger.debug(`Document ${event.textDocument.uri} was openend. Adding it from the store.`)
                await this.doFullSync(event.textDocument, event.textDocument.languageId, event.textDocument.text)
            }
        )

        connectionLocator.connection.onDidChangeTextDocument(
            async (event): Promise<void> => {
                this.logger.debug(`Document ${event.textDocument.uri} was changed. Refreshing its entry in the store.`)

                for (const change of event.contentChanges) {
                    if (!change) {
                        continue
                    }

                    const oldRichDoc = this.textDocuments.get(event.textDocument.uri)

                    if (!oldRichDoc) {
                        continue
                    }

                    if (!change.range) {
                        await this.doFullSync(event.textDocument, oldRichDoc.textDocument.languageId, change.text)
                    } else {
                        await this.doIncrementalSync(oldRichDoc.textDocument, event.textDocument, change)
                    }
                }
            }
        )
    }

    getTextDocument(uri: string): TextDocumentWrapper | null {
        const document = this.textDocuments.get(uri)
        if (null == document) {
            return null
        }

        return document
    }

    private applyChangesToTextDocumentContent(
        oldDocument: TextDocument,
        change: TextDocumentContentChangeEvent
    ): null | string {
        if (null == change.range) {
            return null
        }

        const startOffset = oldDocument.offsetAt(change.range.start)
        const endOffset = oldDocument.offsetAt(change.range.end)
        const before = oldDocument.getText().substr(0, startOffset)
        const after = oldDocument.getText().substr(endOffset)
        return `${before}${change.text}${after}`
    }

    private async doFullSync(
        textDocument: VersionedTextDocumentIdentifier,
        languageId: string,
        content: string
    ): Promise<void> {
        this.logger.debug(`Performing full sync of ${languageId} document '${textDocument.uri}'`)

        const newDocument = TextDocument.create(textDocument.uri, languageId, textDocument.version || -1, content)

        this.textDocuments.set(textDocument.uri, new TextDocumentWrapper(newDocument))
    }

    private async doIncrementalSync(
        oldDocument: TextDocument,
        newDocument: VersionedTextDocumentIdentifier,
        change: TextDocumentContentChangeEvent
    ): Promise<void> {
        if (!change || !change.range) {
            return
        }

        const newContent = this.applyChangesToTextDocumentContent(oldDocument, change)
        if (newContent == null) {
            return
        }

        this.logger.debug(`Performing incremental sync of ${oldDocument.languageId} document '${oldDocument.uri}'`)

        const newTextDocument = TextDocument.create(
            oldDocument.uri,
            oldDocument.languageId,
            newDocument.version || -1,
            newContent
        )

        this.textDocuments.set(newDocument.uri, new TextDocumentWrapper(newTextDocument))
    }
}
