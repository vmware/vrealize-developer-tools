/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AbstractWatcher, AutoWire, Logger, MavenProfilesMap } from "vrealize-common"
import { Disposable } from "vscode-languageserver"

import { remote } from "../../public"
import { ConnectionLocator } from "../core/ConnectionLocator"

export type ProfilesChangeListener = (event: MavenProfilesMap) => void

@AutoWire
export class MavenProfileWatcher extends AbstractWatcher<MavenProfilesMap> implements Disposable {
    protected readonly logger = Logger.get("MavenProfileWatcher")
    private readonly subscriptions: Disposable[] = []

    constructor(connectionLocator: ConnectionLocator) {
        super()

        // Note: there can be only one notification handler per type
        // https://github.com/Microsoft/vscode-languageserver-node/issues/299
        connectionLocator.connection.onNotification(
            remote.client.didChangeMavenProfiles,
            (profiles: MavenProfilesMap) => this.mavenProfilesChanged(profiles)
        )
    }
    onDidChangeMavenProfiles(listener: ProfilesChangeListener): Disposable {
        return this.registerListener(listener)
    }

    dispose(): void {
        this.logger.debug("Disposing MavenProfileWatcher")
        this.subscriptions.forEach(s => s && s.dispose())
    }

    private mavenProfilesChanged(profiles: MavenProfilesMap): void {
        this.logger.debug(`Received notification about changed maven profiles.`, profiles)
        if (profiles) {
            this.notifyListeners(profiles)
        }
    }
}
