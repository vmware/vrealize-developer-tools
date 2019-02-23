/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { types } from "../../public"

export class TextDocumentWrapper {
    constructor(readonly textDocument: types.TextDocument) { }

    public getWordAt(position: types.Position): string {
        const text = this.textDocument.getText()
        const offset = this.textDocument.offsetAt(position)
        let start = offset

        while (0 < start && !this.isWhitespace(text[start])) {
            start--
        }

        let end = offset
        while (end < text.length && !this.isWhitespace(text[end])) {
            end++
        }

        return text.substring(start, end)
    }

    public getLineContentUntil(position: types.Position): string {
        const startPosition = {
            character: 0,
            line: position.line
        }

        const endPosition = position
        const startOffset = this.textDocument.offsetAt(startPosition)
        const endOffset = this.textDocument.offsetAt(endPosition)
        const lineContent = this.textDocument.getText().substring(startOffset, endOffset)

        return lineContent
    }

    private isWhitespace(str: string): boolean {
        return str.trim() === ""
    }
}
