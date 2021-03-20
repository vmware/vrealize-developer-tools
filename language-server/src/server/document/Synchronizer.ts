/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import { TextDocuments } from "vscode-languageserver"
import { TextDocument } from "vscode-languageserver-textdocument"

import { ConnectionLocator } from "../core"
import { TextDocumentWrapper } from "./TextDocumentWrapper"

@AutoWire
export class Synchronizer {
    private readonly logger = Logger.get("Synchronizer")
    private textDocuments = new TextDocuments(TextDocument)

    constructor(connectionLocator: ConnectionLocator) {
        this.logger.info("Initilized the Document Synchronizer")
        this.textDocuments.listen(connectionLocator.connection)
    }

    getTextDocument(uri: string): TextDocumentWrapper | null {
        const document = this.textDocuments.get(uri)
        if (!document) {
            return null
        }

        return new TextDocumentWrapper(document)
    }
}
