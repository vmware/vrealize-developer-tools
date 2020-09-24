/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as server from "vscode-languageserver"

const Capabilities: server.ServerCapabilities = {
    codeActionProvider: false,
    // codeLensProvider: {
    //     resolveProvider: false
    // },
    completionProvider: {
        resolveProvider: false,
        triggerCharacters: [".", '"']
    },
    // signatureHelpProvider: {
    //     triggerCharacters: ["(", ","]
    // },
    definitionProvider: false,
    documentFormattingProvider: false,
    documentHighlightProvider: false,
    documentSymbolProvider: false,
    hoverProvider: false,
    referencesProvider: false,
    renameProvider: false,
    textDocumentSync: server.TextDocumentSyncKind.Incremental,
    workspaceSymbolProvider: false,
    workspace: {
        workspaceFolders: {
            changeNotifications: true,
            supported: true
        }
    }
}

export default Capabilities
