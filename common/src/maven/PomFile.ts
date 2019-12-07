/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as xmlParser from "fast-xml-parser"
import * as fs from "fs-extra"

export class PomFile {
    static readonly ParentGroupByArtifact = {
        "base-package": "com.vmware.pscoe.o11n",
        "actions-package": "com.vmware.pscoe.o11n",
        "xml-package": "com.vmware.pscoe.o11n",
        "typescript-project": "com.vmware.pscoe.o11n",
        "vra-package": "com.vmware.pscoe.vra",
        "vra-ng-package": "com.vmware.pscoe.vra-ng"
    }

    readonly jsonContent: any

    get groupId(): string {
        return this.jsonContent.project.groupId
    }

    get artifactId(): string {
        return this.jsonContent.project.artifactId
    }

    get version(): string {
        return this.jsonContent.project.version
    }

    get parentId(): string {
        const parent = this.jsonContent.project.parent
        return `${parent.groupId}:${parent.artifactId}`
    }

    get parentVersion(): string {
        return this.jsonContent.project.parent.version
    }

    get isBase(): boolean {
        return this.jsonContent.project.parent.artifactId === "base-package"
    }

    get modules(): string[] {
        const modules = this.jsonContent.project.modules
        if (!modules) {
            return []
        }

        return modules.module || []
    }

    constructor(public readonly filePath: string) {
        const pomContent = fs.readFileSync(filePath, { encoding: "utf8" })
        this.jsonContent = xmlParser.parse(pomContent)

        if (!this.jsonContent.project || !this.jsonContent.project.parent) {
            throw new Error(`Missing parent tag [file = ${filePath}]`)
        }

        const groupId: string = this.jsonContent.project.parent.groupId
        const artifactId: string = this.jsonContent.project.parent.artifactId

        if (!groupId || !artifactId) {
            throw new Error(`Missing parent groupId or artifactId - ${groupId}:${artifactId} [file = ${filePath}]`)
        }

        if (PomFile.ParentGroupByArtifact[artifactId] !== groupId) {
            throw new Error(`Not a valid vRealize project parent ID - ${groupId}:${artifactId} [file = ${filePath}]`)
        }
    }
}
