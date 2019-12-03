/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"


import { BaseEnvironment } from "../platform"
import { MavenInfo } from "../types"

import { Logger, proc } from ".."

const archetypeIdByProjectType: { [key: string]: string } = {
    "vro-ts": "package-typescript-archetype",
    "vro-js": "package-actions-archetype",
    "vro-xml": "package-xml-archetype",
    "vro-mixed": "package-mixed-archetype",
    "vra-yaml": "package-vra-archetype",
    "vra-vro": "package-vrealize-archetype",
    "vra-ng": "package-vra-ng-archetype"
}

export class MavenCliProxy {
    constructor(private environment: BaseEnvironment, private mavenSettings: MavenInfo, private logger: Logger) {
        logger.debug(`Initializing Maven CLI proxy for profile '${mavenSettings.profile}'`)
    }

    async getToken(): Promise<string> {
        if (!this.mavenSettings.profile) {
            throw new Error("Cannot retrieve token because of missing value for 'vrdev.maven.profile' setting")
        }

        const tokenFile = this.environment.getGlobalTokenFile()
        const tokenFolder = path.dirname(this.environment.getGlobalTokenFile())
        const tokenPom = path.join(tokenFolder, "pom.xml")
        this.writeTokenPom(tokenPom)

        let token = fs.existsSync(tokenFile) ? this.readTokenFile(tokenFile) : null
        if (!token || this.isExpired(token)) {
            const command = `mvn vrealize:auth -P${this.mavenSettings.profile} -DoutputDir="${tokenFolder}" -N -e`
            const cmdOptions = { cwd: tokenFolder }

            await proc.exec(command, cmdOptions, this.logger)
            token = this.readTokenFile(tokenFile)
        }

        return token.value
    }

    createProject(
        projectType: string,
        groupId: string,
        artifactId: string,
        destinationDir: string,
        requiresWorkflows: boolean,
        workflowsPath?: string
    ): Promise<proc.CmdResult> {
        const archetypeId = archetypeIdByProjectType[projectType]

        if (!archetypeId) {
            return Promise.reject(`Unsupported project type: ${projectType}`)
        }

        let archetypeGroup = "o11n"

        if (projectType === "vra-yaml") {
            archetypeGroup = "vra"
        } else if (projectType === "vra-ng") {
            archetypeGroup = "vra-ng"
        }

        let command =
            `mvn archetype:generate -DinteractiveMode=false ` +
            `-DarchetypeGroupId=com.vmware.pscoe.${archetypeGroup}.archetypes ` +
            `-DarchetypeArtifactId=${archetypeId} ` +
            `-DarchetypeVersion=${this.environment.buildToolsVersion} ` +
            `-DgroupId=${groupId} ` +
            `-DartifactId=${artifactId}`

        if (requiresWorkflows) {
            if (!workflowsPath) {
                return Promise.reject(`Project type ${projectType} requires a workflows directory`)
            }

            command += ` -DworkflowsPath="${workflowsPath}"`
        }

        return proc.exec(command, { cwd: destinationDir }, this.logger)
    }

    copyDependency(
        groupId: string,
        artifactId: string,
        version: string,
        packaging: string,
        destinationDir: string
    ): Promise<proc.CmdResult> {
        const command =
            `mvn dependency:copy ` +
            `-Dartifact=${groupId}:${artifactId}:${version}:${packaging} ` +
            `-DoutputDirectory="${destinationDir}" ` +
            `-Dmdep.stripVersion=true `

        return proc.exec(command, { cwd: destinationDir }, this.logger)
    }

    private readTokenFile(filePath: string): { value: string; expirationDate: string } {
        const content = fs.readFileSync(filePath, { encoding: "utf8" })
        const token = JSON.parse(content)

        if (!token || !token.value || !token.expirationDate) {
            throw new Error(`Missing or invalid token file: ${filePath}`)
        }

        return token
    }

    private writeTokenPom(filePath: string): void {
        const content = `<?xml version="1.0" encoding="UTF-8"?>
<project>
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.vmware.pscoe.o11n</groupId>
    <artifactId>token-pom</artifactId>
    <version>1</version>
    <packaging>pom</packaging>

    <parent>
		<groupId>com.vmware.pscoe.o11n</groupId>
		<artifactId>base-package</artifactId>
		<version>${this.environment.buildToolsVersion}</version>
	</parent>
</project>`

        fs.writeFileSync(filePath, content)
    }

    private isExpired(token: { value: string; expirationDate: string }): boolean {
        const expirationDate = Date.parse(token.expirationDate)
        const now = Date.now()

        return now > expirationDate
    }
}
