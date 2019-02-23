/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "vrealize-common"
import { remote } from "vro-language-server"
import * as vscode from "vscode"

import { LanguageServices } from "../../lang"

export class VroDocument {
    private uri: vscode.Uri
    private source: string
    private languageServices: LanguageServices

    private readonly logger = Logger.get("VroDocument")

    constructor(uri: vscode.Uri, languageServices: LanguageServices) {
        this.uri = uri
        this.languageServices = languageServices
    }

    get value(): string | Thenable<string> {
        if (!this.source) {
            return this.fetch()
        }

        return this.source
    }

    private fetch(): Thenable<string> {
        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Window
        }, progress => {
            return new Promise(async (resolve, reject) => {
                const languageClient = this.languageServices.client

                if (!languageClient) {
                    reject("The vRO language server is not running")
                    return
                }
                const location = this.uri.toString()
                this.logger.info(`Fetching resource: ${location}`)
                const name = this.uri.path.substring(this.uri.path.lastIndexOf("/") + 1, this.uri.path.lastIndexOf("."))
                progress.report({ message: `Fetching ${name}...` })
                try {
                    const source = await languageClient.sendRequest(remote.server.giveEntitySource, location)
                    this.logger.info(`Successfully fetched resource: ${location}`)
                    resolve(source)
                } catch (err) {
                    this.logger.error(`Failed fetching resource: ${location}`)
                    reject(err)
                    // tslint:disable-next-line:max-line-length
                    vscode.window.showErrorMessage(`Failed fetching resource (${err.code}). See logs for more information.`)
                }
            })
        })
    }
}
