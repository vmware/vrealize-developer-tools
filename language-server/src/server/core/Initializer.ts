/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger } from "vrealize-common"
import { Disposable, InitializeParams } from "vscode-languageserver"

import { InitializedParams, ServerCapabilities } from "../../public/types"

import capabilities from "./Capabilities"
import { ConnectionLocator } from "./ConnectionLocator"

export type InitListener = (event: InitializeParams) => void
export type InitdListener = (event: InitializedParams) => void

@AutoWire
export class Initializer {
    private initListeners: InitListener[] = []
    private initdListeners: InitdListener[] = []

    private readonly logger = Logger.get("Initializer")

    constructor(connectionLocator: ConnectionLocator) {
        connectionLocator.connection.onInitialize(e => this.initialize(e))
        connectionLocator.connection.onInitialized(e => this.initialized(e))
    }

    private initialize(event: InitializeParams): { capabilities: ServerCapabilities } {
        this.logger.info("Initializing all registered components... capabilities = ", {
            client: event.capabilities,
            server: capabilities
        })

        this.initListeners.forEach(l => {
            l(event)
        })

        return { capabilities }
    }

    private initialized(event: InitializedParams): void {
        this.initdListeners.forEach(l => {
            l(event)
        })
    }

    public onInitialize(l: InitListener): Disposable {
        this.initListeners.push(l)

        return {
            dispose: () => this.initListeners.splice(this.initListeners.indexOf(l), 1)
        }
    }

    public onInitialized(l: InitdListener): Disposable {
        this.initdListeners.push(l)

        return {
            dispose: () => this.initdListeners.splice(this.initdListeners.indexOf(l), 1)
        }
    }
}
