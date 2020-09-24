/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as xmlParser from "fast-xml-parser"
import * as semver from "semver"
import { Logger, PomFile } from "vrealize-common"
import * as vscode from "vscode"

import { Patterns } from "../../constants"
import { PomLintRule } from "../PomLintRule"

export class ToolchainVersionRule extends PomLintRule {
    private readonly logger = Logger.get("ToolchainVersionRule")

    get ruleCode(): string {
        return "toolchain-version"
    }

    apply(document: vscode.TextDocument): vscode.Diagnostic[] {
        const pomXmlContent = document.getText()
        if (!xmlParser.validate(pomXmlContent)) {
            this.logger.info("Not valid XML")
            return []
        }
        const version = this.extractParentVersion(pomXmlContent)

        if (!version) {
            return []
        }

        if (semver.gte(version, this.lintContext.environment.buildToolsVersion)) {
            this.logger.info(
                `Project parent version (${version}) is higher or ` +
                    `equal to vRealize Build Tools's version (${this.lintContext.environment.buildToolsVersion})`
            )
            return []
        }

        const range = this.calculateVersionRange(pomXmlContent, version, document)

        if (!range) {
            return []
        }

        const message =
            `Outdated version: Parent version (${version}) is lower than ` +
            `the vRealize Build Tools version (${this.lintContext.environment.buildToolsVersion})`
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning)
        diagnostic.code = "toolchain-version"
        diagnostic.source = this.lintContext.environment.displayName

        return [diagnostic]
    }

    fix(text: string): string {
        return this.lintContext.environment.buildToolsVersion
    }

    private extractParentVersion(pomXmlContent: string): string | null {
        const pomXml = xmlParser.parse(pomXmlContent)

        if (!pomXml.project || !pomXml.project.parent) {
            this.logger.warn("Missing parent tag")
            return null
        }

        const groupId: string = pomXml.project.parent.groupId
        const artifactId: string = pomXml.project.parent.artifactId
        const version: string = pomXml.project.parent.version

        if (!groupId || !artifactId) {
            this.logger.warn(`Missing groupId or artifactId - ${groupId}.${artifactId}`)
            return null
        }

        if (PomFile.ParentGroupByArtifact[artifactId] !== groupId) {
            this.logger.warn(`Not a valid vRO project parent ID - ${groupId}.${artifactId}`)
            return null
        }

        return version
    }

    private calculateVersionRange(
        pomXmlContent: string,
        pomParentVersion: string,
        document: vscode.TextDocument
    ): vscode.Range | null {
        let versionAbsolutePosition = 0

        const parentTagSearchResults = Patterns.PomParent.exec(pomXmlContent)
        if (!parentTagSearchResults) {
            this.logger.error("Could not find parent tag contents")
            return null
        }

        versionAbsolutePosition += parentTagSearchResults.index
        const parentTagContent = parentTagSearchResults[0]
        const versionPosInsideParent = parentTagContent.indexOf(pomParentVersion)

        if (versionPosInsideParent < 0) {
            this.logger.error("Could not find version tag contents")
            return null
        }

        versionAbsolutePosition += versionPosInsideParent
        const versionPosition = document.positionAt(versionAbsolutePosition)
        const versionLine = document.lineAt(versionPosition)
        let range = versionLine.range
        const start = versionLine.text.indexOf(pomParentVersion)
        const end = start + pomParentVersion.length
        range = range.with(range.start.with(undefined, start), range.end.with(undefined, end))
        this.logger.debug(`Version position: Ln ${range.start.line} (${range.start.character}-${range.end.character})`)

        return range
    }
}
