/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"
import * as fs from "fs-extra"

import { ClientWindow } from "../../ui"
import { Registrable } from "../../Registrable"
import { ConfigurationManager, EnvironmentManager } from "../../manager"
import { RemoteDocument } from "./RemoteDocument"
import { ContentLocation } from "./ContentLocation"

@AutoWire
export class ContentProvider implements vscode.TextDocumentContentProvider, Registrable {
    private subscriptions: vscode.Disposable
    private documents = new Map<string, RemoteDocument>()
    private restClient: VroRestClient
    private storagePath: string

    private readonly logger = Logger.get("ContentProvider")

    constructor(environment: EnvironmentManager, config: ConfigurationManager) {
        this.restClient = new VroRestClient(config, environment)
    }

    dispose() {
        this.subscriptions.dispose()
        this.documents.clear()
    }

    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void {
        this.logger.debug(`Registering content provider for URI scheme ${ContentLocation.VRO_URI_SCHEME}`)
        this.subscriptions = vscode.workspace.onDidCloseTextDocument(doc => this.documents.delete(doc.uri.toString()))
        const providerRegistration = vscode.workspace.registerTextDocumentContentProvider(
            ContentLocation.VRO_URI_SCHEME,
            this
        )

        context.subscriptions.push(this, providerRegistration)

        this.storagePath = path.join(context["globalStoragePath"], "content")
        if (!fs.existsSync(this.storagePath)) {
            fs.mkdirpSync(this.storagePath)
        }
    }

    async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
        let document = this.documents.get(uri.toString())
        if (document) {
            return document.value
        }

        document = new RemoteDocument(uri, this.restClient, this.storagePath)
        this.documents.set(uri.toString(), document)
        return document.value
    }
}
