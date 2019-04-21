/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, BaseConfiguration, Logger, MavenProfilesMap } from "vrealize-common"
import * as server from "vscode-languageserver"

import { MavenProfileWatcher } from "../maven"
import { ConfigurationWatcher } from "./ConfigurationWatcher"
import { Initializer } from "./Initializer"

@AutoWire
export class Settings extends BaseConfiguration {
    constructor(configWatcher: ConfigurationWatcher, profilesWatcher: MavenProfileWatcher, initializer: Initializer) {
        super()

        configWatcher.onDidChangeConfiguration(this.onDidChangeConfiguration.bind(this))
        profilesWatcher.onDidChangeMavenProfiles(this.onDidChangeProfiles.bind(this))
        initializer.onInitialize(this.initialize.bind(this))
    }

    private initialize(event: server.InitializeParams): void {
        this.vrdev = event.initializationOptions ? event.initializationOptions : {}
        Logger.setup(undefined, this.vrdev.log)
    }

    private onDidChangeConfiguration({ settings }: server.DidChangeConfigurationParams): void {
        this.vrdev = settings.vrdev
        Logger.setup(undefined, this.vrdev.log)
    }

    private onDidChangeProfiles(profiles: MavenProfilesMap): void {
        this.allProfiles = profiles
    }
}
