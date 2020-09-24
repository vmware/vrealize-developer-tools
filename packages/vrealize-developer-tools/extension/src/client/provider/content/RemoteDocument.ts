/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { Logger, VroRestClient } from "vrealize-common"
import * as vscode from "vscode"
import * as AdmZip from "adm-zip"
import * as fs from "fs-extra"
import * as xmlParser from "fast-xml-parser"

import { ContentLocation } from "./ContentLocation"

export class RemoteDocument {
    private readonly logger = Logger.get("RemoteDocument")
    private source: string

    constructor(public uri: vscode.Uri, private restClient: VroRestClient, private storagePath: string) {}

    get value(): string | Thenable<string> {
        if (!this.source) {
            return this.fetch()
        }

        return this.source
    }

    private fetch(): Thenable<string> {
        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Window
            },
            progress => {
                return new Promise(async (resolve, reject) => {
                    this.logger.info(`Fetching resource: ${this.uri.toString()}`)
                    const location = ContentLocation.from(this.uri)
                    progress.report({ message: `Fetching ${location.name}...` })

                    try {
                        const filePath = path.join(this.storagePath, location.id)
                        switch (location.type) {
                            case "action": {
                                await this.restClient.fetchAction(location.id, filePath)
                                const fileBuffer = new AdmZip(filePath).readFile("action-content")

                                if (!fileBuffer) {
                                    throw new Error(`Could not extact action content from $filePath`)
                                }

                                this.source = fileBuffer // content is in UTF-16BE
                                    .swap16() // convert to UTF-16LE
                                    .toString("utf16le")
                                this.source = this.toJavaScript(this.source)
                                fs.removeSync(filePath)
                                break
                            }
                            case "workflow": {
                                await this.restClient.fetchWorkflow(location.id, filePath)
                                const fileBuffer = new AdmZip(filePath).readFile("workflow-content")

                                if (!fileBuffer) {
                                    throw new Error(`Could not extact action content from $filePath`)
                                }

                                this.source = fileBuffer // content is in UTF-16BE
                                    .swap16() // convert to UTF-16LE
                                    .toString("utf16le")
                                fs.removeSync(filePath)
                                break
                            }
                            case "config": {
                                this.source = await this.restClient.getConfigElementXml(location.id)
                                break
                            }
                            case "resource": {
                                await this.restClient.fetchResource(location.id, filePath)
                                this.source = fs.readFileSync(filePath).toString()
                                fs.removeSync(filePath)
                                break
                            }
                            default:
                                throw new Error(`Unknow resource type: ${location.type}`)
                        }

                        this.logger.info(`Successfully fetched resource: ${location}`)
                        resolve(this.source)
                    } catch (err) {
                        this.logger.error(`Failed fetching resource '${location}'. Error: `, err)
                        reject(err)

                        vscode.window.showErrorMessage(
                            `Failed fetching resource (${err.code}). See logs for more information.`
                        )
                    }
                })
            }
        )
    }

    private toJavaScript(source: string): string {
        interface ParamInfo { "@n": string; "@t": string; "#text": string }
        let xml = xmlParser.parse(source, { ignoreAttributes: false, attributeNamePrefix: "@" })
        xml = xml["dunes-script-module"]
        let js = "/**\n"

        if (xml.description) {
            const description: string = xml.description
            js += description
                .trim()
                .split("\n")
                .map(line => ` * ${line}`)
                .join("\n")

            js += "\n"
        }

        js += " * \n"

        const params: ParamInfo[] = Array.isArray(xml.param) || !xml.param ? xml.param : [xml.param]
        if (params && params.length > 0) {
            js += params
                .map(p => {
                    const desc = p["#text"] ? ` - ${p["#text"]}` : ""
                    return ` * @param {${p["@t"]}} ${p["@n"]}${desc}`
                })
                .join("\n")

            js += "\n"
        }

        js += ` * @return {${xml["@result-type"] || "Any"}}\n`
        js += ` */\n`
        js += `(function (`

        if (params && params.length > 0) {
            js += params.map(p => p["@n"]).join(",")
        }

        js += ") {\n"

        if (xml.script) {
            const script: string = xml.script["#text"]
            js += script
                .trim()
                .split("\n")
                .map(line => `\t${line}`)
                .join("\n")
        }

        js += "\n});\n"

        return js
    }
}
