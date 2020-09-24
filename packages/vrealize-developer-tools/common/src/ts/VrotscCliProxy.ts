/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as tmp from "tmp"

import { Logger, proc } from ".."

export class VrotscCliProxy {
    constructor(private logger: Logger) {
        logger.debug("Initializing TypeScript compiler CLI proxy")
    }

    /**
     *
     * @param inputFile - path relative to the src folder of the project dir
     * @param projectDirPath - absolute path to the project dir
     * @param namespace - project's namespace (<groupId>.<artifactId> from pom.xml)
     *
     * @returns absolute path to the output JS file
     */
    async compileFile(inputFile: string, projectDirPath: string, namespace?: string): Promise<string> {
        const outputDir = tmp.dirSync({ prefix: "o11n-ts-" }).name
        const vrotscBin = path.join(".", "node_modules", "@vmware-pscoe", "vrotsc", "bin", "vrotsc")
        let command = `${vrotscBin} src/ --actionsOut ${outputDir} --files ${inputFile}`

        if (namespace) {
            command += ` -n ${namespace}`
        }
        await proc.exec(command, { cwd: projectDirPath }, this.logger)
        return path.join(outputDir, inputFile.replace(/\.ts$/, ".js"))
    }
}
