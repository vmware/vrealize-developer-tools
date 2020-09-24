/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Position, Range, TextDocumentIdentifier } from "vscode-languageserver-protocol"

export interface LocatedPosition {
    position: Position
    uri: string
}

export interface TextDocumentData {
    content: string
    languageId: string
    version: number
}

export interface TextDocumentRange {
    range: Range
    textDocument: TextDocumentIdentifier
}
