/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as AdmZip from "adm-zip"
import * as fs from "fs-extra"
import { AutoWire, Logger, promise, VroRestClient } from "vrealize-common"
import { CancellationToken } from "vscode"

import { remote } from "../../../public"
import { ConnectionLocator, Environment, HintLookup, Settings } from "../../core"

export class CollectionStatus {
    message: string = "idle"
    error: string | undefined = undefined
    finished: boolean = false
    timestamp: number
    data: CollectionData = new CollectionData()
}

export class CollectionData {
    hintsPluginBuild: number = -1
    vpkResourceId: string | undefined = undefined
}

@AutoWire
export class ServerCollection {
    private readonly logger = Logger.get("ServerCollection")
    private currentStatus: CollectionStatus = new CollectionStatus()
    private restClient: VroRestClient

    constructor(
        private environment: Environment,
        private hints: HintLookup,
        settings: Settings,
        connectionLocator: ConnectionLocator
    ) {
        connectionLocator.connection.onRequest(
            remote.server.giveVroCollectionStatus,
            this.giveCollectionStatus.bind(this)
        )

        connectionLocator.connection.onRequest(remote.server.triggerVroCollection, this.triggerCollection.bind(this))

        this.restClient = new VroRestClient(settings, environment)
    }

    giveCollectionStatus(): CollectionStatus {
        this.logger.info("Data collection status was requested by the client:", this.currentStatus)
        return this.currentStatus
    }

    triggerCollection(offline: boolean, event: CancellationToken) {
        if (offline) {
            // Load any locally available hint files
            this.hints.initialize()
            return
        }

        this.currentStatus = new CollectionStatus()
        let promise = Promise.resolve()
        const operations = [
            this.verifyVroConnection,
            // this.downloadLatestPlugin,
            // this.installHintingPlugin,
            // this.waitVroServices,
            this.startCollecting,
            this.downloadHintsPack,
            this.done
        ]

        for (const op of operations) {
            promise = promise
                .then(() => {
                    if (event.isCancellationRequested) {
                        this.currentStatus.message = "Operation cancelled"
                        this.currentStatus.finished = true
                    } else if (!this.currentStatus.finished) {
                        return op.apply(this)
                    }

                    return undefined
                })
                .catch(errorMessage => {
                    this.setError(errorMessage)
                })
        }
    }

    async verifyVroConnection() {
        this.currentStatus.message = "Authenticating..."
        this.logger.info(this.currentStatus.message)

        try {
            const responseBody = await this.restClient.getPlugins()
            for (const plugin of responseBody.plugin) {
                if (plugin.moduleName === "HintPlugin" && plugin.enabled) {
                    this.logger.debug("Hint plugin is installed in target vRO: ", plugin)
                    this.currentStatus.data.hintsPluginBuild = plugin.buildNumber
                    return
                }
            }

            this.setError("The vRO Hint plug-in is not installed")
            this.currentStatus.data.hintsPluginBuild = 0
        } catch (error) {
            this.setError(error.message)
            this.currentStatus.data.hintsPluginBuild = -1
        }
    }

    async downloadLatestPlugin() {
        this.currentStatus.message = "Downloading latest plugin..."
        this.logger.info(this.currentStatus.message)
    }

    async installHintingPlugin() {
        this.currentStatus.message = "Installing the plugin..."
        this.logger.info(this.currentStatus.message)
    }

    async waitVroServices() {
        this.currentStatus.message = "Waiting vRO services to start..."
        this.logger.info(this.currentStatus.message)
    }

    async startCollecting() {
        this.currentStatus.message = "Collecting..."
        this.logger.info(this.currentStatus.message)

        try {
            const outParams = await this.restClient.executeWorkflow("548056f3-7dad-49d8-93a4-ba4cff675b72")
            const vpkResourceIdParam = !!outParams && outParams.length > 0 ? outParams[0] : undefined

            if (
                !vpkResourceIdParam ||
                vpkResourceIdParam.name !== "vpkResourceId" ||
                !vpkResourceIdParam.value ||
                !vpkResourceIdParam.value.string ||
                !vpkResourceIdParam.value.string.value
            ) {
                throw new Error("Missing vpkResourceId output parameter")
            }

            this.currentStatus.data.vpkResourceId = vpkResourceIdParam.value.string.value
        } catch (error) {
            this.setError(error.message)
        }
    }

    async downloadHintsPack() {
        this.currentStatus.message = "Downloading hints package..."
        this.logger.info(this.currentStatus.message)

        try {
            const vpkFilePath = this.environment.resolveVpkFile()
            const hintsDirPath = this.environment.resolveHintsDir()

            if (!hintsDirPath) {
                // should never happen
                throw new Error("Undefined global hints dir path")
            }

            if (fs.existsSync(vpkFilePath)) {
                fs.unlinkSync(vpkFilePath)
            }

            if (fs.existsSync(hintsDirPath)) {
                fs.removeSync(hintsDirPath)
            }

            if (!this.currentStatus.data.vpkResourceId) {
                throw new Error("Missing VPK resource ID")
            }

            const response = await this.restClient.getResource(this.currentStatus.data.vpkResourceId)
            const stream = response.pipe(
                fs.createWriteStream(vpkFilePath),
                { end: true }
            )
            await promise.streamPromise(stream)

            this.currentStatus.message = "Unpacking hints..."
            this.logger.info(this.currentStatus.message)
            new AdmZip(vpkFilePath).extractAllTo(hintsDirPath, true)
        } catch (error) {
            this.setError(error.message)
        }
    }

    async done() {
        this.logger.info("Hint collection has finished.")
        this.currentStatus.message = "Done"
        this.currentStatus.finished = true
        this.currentStatus.timestamp = Date.now()
        this.hints.initialize()
    }

    setError(message: string): void {
        this.logger.error(`An error occurred during hint collection: ${message}`)
        this.currentStatus.message = "An error occurred"
        this.currentStatus.error = message
        this.currentStatus.finished = true
    }
}
