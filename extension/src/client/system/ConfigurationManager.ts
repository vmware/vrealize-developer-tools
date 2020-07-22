/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as chokidar from "chokidar"
import * as xmlParser from "fast-xml-parser"
import * as fs from "fs-extra"
import {
    AutoWire,
    BaseConfiguration,
    Logger,
    MavenProfilesMap,
    MavenProfileWrapper,
    VrealizeSettings
} from "vrealize-common"
import * as vscode from "vscode"

import { BuiltInCommands } from "../constants"
import { Registrable } from "../Registrable"

@AutoWire
export class ConfigurationManager extends BaseConfiguration implements Registrable {
    private homeDir = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || "~"
    private readonly logger = Logger.get("ConfigurationManager")

    readonly settingsXmlPath: string = path.resolve(this.homeDir, ".m2", "settings.xml")

    constructor() {
        super()
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the configuration manager")
        this.vrdev = vscode.workspace.getConfiguration().get<VrealizeSettings>("vrdev") as VrealizeSettings

        vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged, this, context.subscriptions)

        this.subscribeToSettingsXmlChanges(context)
    }

    get activeProfile(): MavenProfileWrapper {
        try {
            return super.activeProfile
        } catch (e) {
            vscode.window.showErrorMessage(e.message)
            throw e
        }
    }

    private _onDidChangeConfig = new vscode.EventEmitter<vscode.ConfigurationChangeEvent>()
    get onDidChangeConfig(): vscode.Event<vscode.ConfigurationChangeEvent> {
        return this._onDidChangeConfig.event
    }

    private _onDidChangeProfiles = new vscode.EventEmitter<MavenProfilesMap>()
    get onDidChangeProfiles(): vscode.Event<MavenProfilesMap> {
        return this._onDidChangeProfiles.event
    }

    private subscribeToSettingsXmlChanges(context: vscode.ExtensionContext) {
        const watcher = chokidar.watch(this.settingsXmlPath, { awaitWriteFinish: true })
        watcher.on("change", this.onMavenProfilesChanged.bind(this))

        const disposable = {
            dispose() {
                watcher.removeAllListeners()
                watcher.close()
            }
        }

        context.subscriptions.push(disposable)
    }

    private onConfigurationChanged(event: vscode.ConfigurationChangeEvent) {
        this.vrdev = vscode.workspace.getConfiguration().get<VrealizeSettings>("vrdev") as VrealizeSettings
        this.logger.debug("Configuration change has been detected. New config: ", this.vrdev)
        Logger.setup(undefined, this.vrdev.log)
        this._onDidChangeConfig.fire(event)
    }

    private onMavenProfilesChanged() {
        this.logger.debug(`Maven settings.xml change event has been detected.`)
        this.forceLoadProfiles()
    }

    forceLoadProfiles(): void {
        if (!fs.existsSync(this.settingsXmlPath)) {
            vscode.window
                .showErrorMessage("Missing maven settings file: ~/.m2/settings.xml", "Reload Window")
                .then(selected => {
                    if (selected === "Reload Window") {
                        vscode.commands.executeCommand(BuiltInCommands.ReloadWindow)
                    }
                })
        }

        const settingsXmlContent = fs.readFileSync(this.settingsXmlPath)

        if (settingsXmlContent.length < 1) {
            this.logger.warn(`Got no content from ${this.settingsXmlPath}`)
            this.allProfiles = undefined
            return
        }

        const settingsJson = xmlParser.parse(settingsXmlContent.toString("utf8"))
        const allProfiles = settingsJson.settings.profiles.profile
        const vroProfiles: MavenProfilesMap = {}

        if (!allProfiles) {
            this.logger.warn(`No profiles found in ${this.settingsXmlPath}`)
            this.allProfiles = undefined
            return
        }

        for (const profile of allProfiles) {
            const propKeys = Object.keys(profile.properties || {})

            if (propKeys.some(key => key === "vro.host")) {
                vroProfiles[profile.id] = {
                    id: profile.id,
                    ...profile.properties
                }
            }
        }

        this.logger.info("Found vRO profiles: ", vroProfiles)
        this.allProfiles = vroProfiles
        this._onDidChangeProfiles.fire(vroProfiles)
    }
}
