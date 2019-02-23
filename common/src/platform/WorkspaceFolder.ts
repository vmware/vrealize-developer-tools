/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import URI, { UriComponents } from "vscode-uri"

export class WorkspaceFolder {
    constructor(readonly uri: URI, readonly name: string) {

    }

    static fromProtocol(source: {uri: string, name: string}): WorkspaceFolder {
        return new WorkspaceFolder(URI.parse(source.uri), source.name)
    }

    static fromVscode(source: { uri: UriComponents, name: string}): WorkspaceFolder {
        return new WorkspaceFolder(URI.from(source.uri), source.name)
    }
}
