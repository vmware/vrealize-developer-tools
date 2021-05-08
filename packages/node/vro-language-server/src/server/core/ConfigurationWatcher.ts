/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AbstractWatcher, AutoWire, Logger } from "@vmware/vrdt-common"
import { DidChangeConfigurationParams, Disposable } from "vscode-languageserver"

import { ConnectionLocator } from "./ConnectionLocator"

export type ConfigChangeListener = (event: DidChangeConfigurationParams) => void

@AutoWire
export class ConfigurationWatcher extends AbstractWatcher<DidChangeConfigurationParams> {
    protected readonly logger = Logger.get("ConfigurationWatcher")

    constructor(connectionLocator: ConnectionLocator) {
        super()
        connectionLocator.connection.onDidChangeConfiguration(this.configurationChanged.bind(this))
    }

    onDidChangeConfiguration(listener: ConfigChangeListener): Disposable {
        return this.registerListener(listener)
    }

    private configurationChanged(event: DidChangeConfigurationParams): void {
        this.logger.info("The configuration has changed. New configuration:", event.settings)
        this.notifyListeners(event)
    }
}
