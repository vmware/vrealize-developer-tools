/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../manager"
import { Registrable } from "../Registrable"

@AutoWire
export class StatusBarController implements Registrable, vscode.Disposable {
    private readonly logger = Logger.get("StatusBarController")
    private readonly collectionButton: vscode.StatusBarItem
    private readonly collectionStatus: vscode.StatusBarItem
    private readonly config: ConfigurationManager
    private readonly env: EnvironmentManager

    profileName: string | undefined

    constructor(config: ConfigurationManager, env: EnvironmentManager) {
        this.logger.debug("Instantiating the status bar controller")

        this.collectionStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10101)
        this.collectionButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10100)
        this.profileName = config.vrdev.maven.profile
        this.config = config
        this.env = env
    }

    register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(this)

        if (this.env.hasRelevantProject()) {
            context.subscriptions.push(
                vscode.commands.registerCommand(Commands.EventCollectionStart, this.onCollectionStart.bind(this)),
                vscode.commands.registerCommand(Commands.EventCollectionSuccess, this.onCollectionSuccess.bind(this)),
                vscode.commands.registerCommand(Commands.EventCollectionError, this.onCollectionError.bind(this))
            )
        }

        this.collectionStatus.text = "$(plug) $(kebab-horizontal)"
        this.collectionStatus.show()

        this.config.onDidChangeConfig(this.onConfigurationOrProfilesChanged, this, context.subscriptions)
        this.config.onDidChangeProfiles(this.onConfigurationOrProfilesChanged, this, context.subscriptions)
    }

    dispose() {
        this.collectionButton.dispose()
        this.collectionStatus.dispose()
    }

    private onConfigurationOrProfilesChanged() {
        const currentProfileName = this.config.hasActiveProfile() ? this.config.activeProfile.get("id") : undefined

        if (this.verifyConfiguration() && currentProfileName !== this.profileName) {
            vscode.commands.executeCommand(Commands.TriggerServerCollection)
        }
    }

    verifyConfiguration(): boolean {
        this.profileName = this.config.hasActiveProfile() ? this.config.activeProfile.get("id") : undefined
        this.logger.info(`Verifying configuration for active profile ${this.profileName}`)

        const serverConfIsValid = !!this.profileName
        if (serverConfIsValid) {
            if (this.env.hasRelevantProject()) {
                this.collectionButton.show()

                this.collectionButton.text = "$(cloud-download)"
                this.collectionButton.command = Commands.TriggerServerCollection
                this.collectionButton.tooltip = "Trigger vRO hint collection"
                this.collectionButton.color = undefined
            }

            const hostname = this.config.activeProfile.get("vro.host")
            this.collectionStatus.text = `$(server) ${this.profileName} (${hostname})`
            this.collectionStatus.tooltip = "Change active profile"
            this.collectionStatus.command = Commands.ChangeProfile

            return true
        }

        const warnMessage = "A vRO maven profile is missing or incomplete."
        this.logger.warn(warnMessage)

        this.collectionButton.hide()

        this.collectionStatus.text = "$(server) $(x)"
        this.collectionStatus.tooltip = warnMessage
        this.collectionStatus.command = Commands.ChangeProfile

        return false
    }

    private onCollectionStart() {
        this.collectionButton.text = "$(watch) "
        this.collectionButton.command = undefined
        this.collectionButton.tooltip = undefined
        this.collectionButton.color = undefined
    }

    private onCollectionSuccess() {
        this.collectionButton.text = "$(cloud-download)"
        this.collectionButton.command = Commands.TriggerServerCollection
        this.collectionButton.tooltip = "Trigger vRO hint collection"
        this.collectionButton.color = undefined
    }

    private onCollectionError(message: string) {
        this.collectionButton.text = "$(alert)"
        this.collectionButton.command = Commands.TriggerServerCollection
        this.collectionButton.tooltip = `Collection failed: ${message}`
        this.collectionButton.color = new vscode.ThemeColor("errorForeground")

        const errorMessage = `Hint collection failed - ${message}`
        this.logger.error(errorMessage)

        vscode.window.showErrorMessage(errorMessage, "Retry").then(selected => {
            if (selected === "Retry") {
                vscode.commands.executeCommand(Commands.TriggerServerCollection)
            }
        })
    }
}
