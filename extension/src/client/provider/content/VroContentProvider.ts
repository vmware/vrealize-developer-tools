/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { uri, AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { LanguageServices } from "../../lang"
import { ClientWindow } from "../../ui"
import { Registrable } from "../../Registrable"

import { VroDocument } from "./VroDocument"

@AutoWire
export class VroContentProvider implements vscode.TextDocumentContentProvider, Registrable {
    private subscriptions: vscode.Disposable
    private documents = new Map<string, VroDocument>()
    private languageServices: LanguageServices

    private readonly logger = Logger.get("VroContentProvider")

    constructor(languageServices: LanguageServices) {
        this.languageServices = languageServices
    }

    dispose() {
        this.subscriptions.dispose()
        this.documents.clear()
    }

    // TODO: Support editing the virtual document and syncing changes back to vRO
    // https://github.com/Microsoft/vscode/issues/10547

    provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
        let document = this.documents.get(uri.toString())
        if (document) {
            return document.value
        }

        document = new VroDocument(uri, this.languageServices)
        this.documents.set(uri.toString(), document)
        return document.value
    }

    register(context: vscode.ExtensionContext,
             clientWindow: ClientWindow): void {
        this.logger.debug(`Registering content provider for URI scheme ${uri.O11N_URI_SCHEME}`)

        this.subscriptions = vscode.workspace.onDidCloseTextDocument(doc => this.documents.delete(doc.uri.toString()))

        const providerRegistration =
            vscode.workspace.registerTextDocumentContentProvider(uri.O11N_URI_SCHEME, this)
        context.subscriptions.push(this, providerRegistration)
    }
}
