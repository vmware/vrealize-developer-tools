/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, MavenProfile } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { ConfigurationManager } from "../manager"
import { Command } from "./Command"

class EditProfilesItem implements vscode.QuickPickItem {
    constructor(private settingsXmlPath: string) {}

    get label(): string {
        return "$(pencil)  Edit profiles"
    }

    get description(): string {
        return ""
    }

    async run(): Promise<void> {
        await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(this.settingsXmlPath))
    }
}

class MavenProfileItem implements vscode.QuickPickItem {
    readonly name: string
    readonly profile: MavenProfile

    get label(): string {
        return `$(server)  ${this.name}` || ""
    }

    get description(): string {
        return `(${this.profile["vro.host"]})` || ""
    }

    constructor(entry: [string, MavenProfile]) {
        this.name = entry[0]
        this.profile = entry[1]
    }

    async run(): Promise<void> {
        await vscode.workspace
            .getConfiguration("vrdev")
            .update("maven.profile", this.name, vscode.ConfigurationTarget.Workspace)
    }
}

@AutoWire
export class ChangeMavenProfile extends Command {
    private readonly logger = Logger.get("ChangeMavenProfile")

    constructor(private config: ConfigurationManager) {
        super()
    }

    get commandId(): string {
        return Commands.ChangeProfile
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Change Active Profile")

        const editProfiles = new EditProfilesItem(this.config.settingsXmlPath)
        let profiles: MavenProfileItem[] = []

        if (this.config.allProfiles) {
            profiles = Object.entries(this.config.allProfiles).map(entry => new MavenProfileItem(entry))
        }

        const picks = [editProfiles, ...profiles]
        const choice = await vscode.window.showQuickPick(picks, { placeHolder: "Pick a maven profile" })

        if (!choice) {
            return
        }

        this.logger.debug("Selected profile: ", choice)
        await choice.run()
    }
}
