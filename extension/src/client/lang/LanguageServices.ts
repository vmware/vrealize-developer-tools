/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger, MavenProfilesMap } from "vrealize-common"
import { remote } from "vro-language-server"
import * as vscode from "vscode"
import * as client from "vscode-languageclient/node"

import { OutputChannels, ProjectArchetypes } from "../constants"
import { Registrable } from "../Registrable"
import { ConfigurationManager, EnvironmentManager } from "../system"

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
    private config: ConfigurationManager
    private env: EnvironmentManager

    constructor(configuration: ConfigurationManager, environment: EnvironmentManager) {
        this.config = configuration
        this.env = environment
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

    register(context: vscode.ExtensionContext): void {
        this.extensionContext = context
        this.config.onDidChangeProfiles(this.onMavenProfilesChanged, this, context.subscriptions)
    }

    initialize(): Promise<void> {
        if (!this.env.hasRelevantProject(prj => prj.is(ProjectArchetypes.Actions))) {
            return Promise.resolve()
        }

        this.outputChannel = vscode.window.createOutputChannel(OutputChannels.LanguageServerLogs)
        this.languageClient = this.newLanguageClient()
        this.languageClient.start()
        return this.languageClient.onReady()
    }

    private onMavenProfilesChanged(profiles: MavenProfilesMap) {
        if (this.languageClient) {
            this.languageClient.sendNotification(remote.client.didChangeMavenProfiles, profiles)
        }
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
