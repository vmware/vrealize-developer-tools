/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"
import * as client from "vscode-languageclient"

import { OutputChannels } from "../constants"
import { ClientWindow } from "../ui"
import { Registrable } from "../Registrable"

class ErrorHandler {
    closed(): client.CloseAction {
        return client.CloseAction.DoNotRestart
    }

    error(): client.ErrorAction {
        return client.ErrorAction.Shutdown
    }
}

@AutoWire
export class LanguageServices implements Registrable, vscode.Disposable {
    private logger = Logger.get("LanguageServices")
    private languageClient: client.LanguageClient | undefined
    private outputChannel: vscode.OutputChannel
    private extensionContext: vscode.ExtensionContext

    constructor() {
        // empty
    }

    get client(): client.LanguageClient | undefined {
        return this.languageClient
    }

    dispose() {
        if (this.languageClient) {
            return this.languageClient.stop()
        }

        return Promise.resolve()
    }

    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void {
        this.extensionContext = context
    }

    initialize(): Promise<void> {
        this.outputChannel = vscode.window.createOutputChannel(OutputChannels.LanguageServerLogs)
        this.languageClient = this.newLanguageClient()
        this.languageClient.start()
        return this.languageClient.onReady()
    }

    private newLanguageClient(): client.LanguageClient {
        const config = vscode.workspace.getConfiguration("vrdev")
        const module = this.extensionContext.asAbsolutePath(path.join("language-server"))
        const executable = path.join(module, "out", "server", "langserver.js")
        this.logger.info(`Starting vRO language server on port 6014`)

        const serverOptions = {
            run: {
                module: executable,
                transport: client.TransportKind.ipc,
                args: ["--node-ipc"],
                options: { cwd: module }
            },
            debug: {
                module: executable,
                transport: client.TransportKind.ipc,
                args: ["--node-ipc"],
                options: { cwd: module, execArgv: ["--nolazy", "--inspect=6014"] }
            }
        }

        const clientOptions: client.LanguageClientOptions = {
            documentSelector: [
                {
                    language: "javascript",
                    scheme: "file"
                }
            ],
            errorHandler: new ErrorHandler(),
            initializationOptions: config,
            outputChannel: this.outputChannel,
            revealOutputChannelOn: client.RevealOutputChannelOn.Never,
            stdioEncoding: "utf8",
            synchronize: {
                configurationSection: "vrdev",
                fileEvents: [
                    vscode.workspace.createFileSystemWatcher("**/src/**/*.js"),
                    vscode.workspace.createFileSystemWatcher("**/pom.xml")
                ]
            }
        }
        return new client.LanguageClient("vRO LS", serverOptions, clientOptions)
    }
}
