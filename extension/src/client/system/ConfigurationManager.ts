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
import { remote } from "vro-language-server"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { LanguageServices } from "../lang"
import { ClientWindow } from "../ui"
import { Registrable } from "../Registrable"

@AutoWire
export class ConfigurationManager extends BaseConfiguration implements Registrable {
    private clientWindow: ClientWindow
    private languageServices: LanguageServices

    private homeDir = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"] || "~"
    private readonly logger = Logger.get("ConfigurationManager")

    readonly settingsXmlPath: string = path.resolve(this.homeDir, ".m2", "settings.xml")

    constructor(languageServices: LanguageServices) {
        super()
        this.languageServices = languageServices
    }

    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void {
        this.logger.debug("Registering the configuration manager")
        this.clientWindow = clientWindow
        this.vrdev = vscode.workspace.getConfiguration().get<VrealizeSettings>("vrdev") as VrealizeSettings

        vscode.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, context.subscriptions)

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

    private subscribeToSettingsXmlChanges(context: vscode.ExtensionContext) {
        const watcher = chokidar.watch(this.settingsXmlPath, { awaitWriteFinish: true })
        watcher.on("change", this.onDidChangeProfiles.bind(this))

        const disposable = {
            dispose() {
                watcher.removeAllListeners()
                watcher.close()
            }
        }

        context.subscriptions.push(disposable)
        // force load profiles and send notification to the LS upon initialization
        this.onDidChangeProfiles()
    }

    private onDidChangeConfiguration(event: vscode.ConfigurationChangeEvent) {
        this.vrdev = vscode.workspace.getConfiguration().get<VrealizeSettings>("vrdev") as VrealizeSettings
        this.logger.debug("Configuration change has been detected. New config: ", this.vrdev)
        Logger.setup(undefined, this.vrdev.log)
        this.updateClientWindow()
    }

    private onDidChangeProfiles() {
        this.logger.debug(`Maven settings.xml change event has been detected.`)

        this.allProfiles = this.forceLoadProfiles()
        if (this.allProfiles) {
            if (this.languageServices.client) {
                this.languageServices.client.sendNotification(remote.client.didChangeMavenProfiles, this.allProfiles)
            }

            this.updateClientWindow()
        }
    }

    private forceLoadProfiles(): MavenProfilesMap | undefined {
        if (!fs.existsSync(this.settingsXmlPath)) {
            vscode.window.showErrorMessage("Missing maven settings file: ~/.m2/settings.xml", "Reload Window").then(selected => {
                if (selected === "Reload Window") {
                    vscode.commands.executeCommand("workbench.action.reloadWindow")
                }
            })
        }

        const settingsXmlContent = fs.readFileSync(this.settingsXmlPath)

        if (settingsXmlContent.length < 1) {
            this.logger.warn(`Got no content from ${this.settingsXmlPath}`)
            return undefined
        }

        const settingsJson = xmlParser.parse(settingsXmlContent.toString("utf8"))
        const allProfiles = settingsJson.settings.profiles.profile
        const vroProfiles: MavenProfilesMap = {}

        if (!allProfiles) {
            this.logger.warn(`No profiles found in ${this.settingsXmlPath}`)
            return undefined
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
        return vroProfiles
    }

    private updateClientWindow() {
        const currentProfileName = this.hasActiveProfile() ? this.activeProfile.get("id") : undefined

        if (this.clientWindow.verifyConfiguration(this) && currentProfileName !== this.clientWindow.profileName) {
            vscode.commands.executeCommand(Commands.TriggerServerCollection, this.clientWindow)
        }
    }
}
