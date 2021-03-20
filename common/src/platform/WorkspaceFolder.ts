/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { URI } from "vscode-uri"
import { UriComponents } from "vscode-uri/lib/umd/uri"

import { default as Logger } from "../logger"
import { PomFile } from "../maven"

export class WorkspaceFolder {
    private readonly logger = Logger.get("WorkspaceFolder")

    constructor(public readonly uri: URI, public readonly name: string) {}

    get projectType(): string | undefined {
        try {
            const pomFile = new PomFile(path.join(this.uri.fsPath, "pom.xml"))
            return pomFile.parentId
        } catch (e) {
            this.logger.warn(`Could not find project type of workspace folder ${this.uri.fsPath}`, e)
            return undefined
        }
    }

    is(otherType: string): boolean {
        const thisType = this.projectType
        if (!thisType || !otherType) {
            return false
        }

        return thisType === otherType
    }

    static fromProtocol(source: { uri: string; name: string }): WorkspaceFolder {
        return new WorkspaceFolder(URI.parse(source.uri), source.name)
    }

    static fromVscode(source: { uri: UriComponents; name: string }): WorkspaceFolder {
        return new WorkspaceFolder(URI.from(source.uri), source.name)
    }
}
