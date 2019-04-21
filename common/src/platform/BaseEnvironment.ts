/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"
import * as glob from "glob"

import { default as Logger } from "../logger"
import { BaseConfiguration } from "./BaseConfiguration"
import { WorkspaceFolder } from "./WorkspaceFolder"

export abstract class BaseEnvironment {
    protected abstract readonly logger: Logger
    protected abstract config: BaseConfiguration
    public abstract workspaceFolders: WorkspaceFolder[]

    get version(): string {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const packageJson = require("../../../package.json")
        return packageJson.version.trim()
    }

    get buildToolsVersion(): string {
        return this.config.vrdev.buildTools.defaultVersion
    }

    get homeDir(): string {
        const homeEnvVar = process.platform === "win32" ? "USERPROFILE" : "HOME"
        const value = process.env[homeEnvVar]

        if (!value) {
            throw new Error(`Missing '${homeEnvVar}' environment variable`)
        }

        return value
    }

    getWorkspaceFolderOf(resourcePath: string): WorkspaceFolder | undefined {
        if (!this.workspaceFolders || this.workspaceFolders.length === 0) {
            return undefined
        }

        const descSorted = this.workspaceFolders.sort((a, b) => {
            return b.uri.fsPath.length - a.uri.fsPath.length
        })

        for (const element of descSorted) {
            if (resourcePath.startsWith(`${element.uri.fsPath}${path.sep}`)) {
                return element
            }
        }

        return undefined
    }

    getGlobalHintsDir(): string {
        return this.createAndResolveDir(this.homeDir, ".o11n", "hints")
    }

    getGlobalTokenFile(): string {
        const tokensFolder = this.createAndResolveDir(this.homeDir, ".o11n", "tokens")
        return path.join(tokensFolder, this.getHostname())
    }

    getLocalHintsDir(workspaceFolder: WorkspaceFolder): string {
        return this.createAndResolveDir(workspaceFolder.uri.fsPath, ".o11n", "hints")
    }

    getGlobalO11nDir(): string {
        return this.createAndResolveDir(this.homeDir, ".o11n")
    }

    getLocalO11nDir(workspaceFolder: WorkspaceFolder): string {
        return this.createAndResolveDir(workspaceFolder.uri.fsPath, ".o11n")
    }

    resolveHintFile(name: string, workspaceFolder?: WorkspaceFolder): string {
        if (workspaceFolder) {
            return path.join(this.getLocalHintsDir(workspaceFolder), name)
        }

        return path.join(this.getGlobalHintsDir(), this.getHostname(), name)
    }

    resolveVpkFile(): string {
        return path.join(this.getGlobalHintsDir(), `${this.getHostname()}.vpk`)
    }

    resolveHintsDir(workspaceFolder?: WorkspaceFolder): string {
        if (workspaceFolder) {
            return this.getLocalHintsDir(workspaceFolder)
        }

        return path.join(this.getGlobalHintsDir(), this.getHostname())
    }

    resolveOutputFile(name: string, workspaceFolder: WorkspaceFolder): string {
        return path.join(this.getLocalHintsDir(workspaceFolder), "..", name)
    }

    resolvePluginHintFiles(): string[] {
        const workingDir = path.join(this.getGlobalHintsDir(), this.getHostname(), "plugins")
        return glob.sync("./*.pb", { cwd: workingDir, absolute: true })
    }

    resolveDependenciesHintFiles(workspaceFolder: WorkspaceFolder): string[] {
        const dependenciesHintsDir = path.join(this.getLocalHintsDir(workspaceFolder), "dependencies")
        const dependenciesHintFiles = glob.sync("./*.pb", { cwd: dependenciesHintsDir, absolute: true })
        return dependenciesHintFiles
    }

    private createAndResolveDir(...paths: string[]): string {
        const dir = path.join(...paths)
        fs.ensureDirSync(dir)
        return dir
    }

    private getHostname(): string {
        if (!this.config.hasActiveProfile()) {
            return ""
        }

        return this.config.activeProfile.getOptional("vro.host", "")
    }
}
