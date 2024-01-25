/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { CancellationToken } from "vscode-languageserver"
import { AutoWire, HintAction, HintModule, HintPlugin, Logger, VroRestClient } from "@vmware/vrdt-common"

import { remote } from "../../../public"
import { ConnectionLocator, Environment, HintLookup, Settings } from "../../core"
import { WorkspaceCollection } from "./WorkspaceCollection"
import { vmw } from "../../../proto"

@AutoWire
export class CollectionStatus {
    message: string = "idle"
    error: string | undefined = undefined
    finished: boolean = false
    timestamp: number
    data: CollectionData = new CollectionData()
}

@AutoWire
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
        connectionLocator: ConnectionLocator,
        private workspaceCollection: WorkspaceCollection
    ) {
        this.logger.info(`Server collection constructor`)
        connectionLocator.connection.onRequest(
            remote.server.giveVroCollectionStatus,
            this.giveCollectionStatus.bind(this)
        )

        connectionLocator.connection.onRequest(remote.server.triggerVroCollection, this.triggerCollection.bind(this))

        this.restClient = new VroRestClient(settings)
    }

    giveCollectionStatus(): CollectionStatus {
        this.logger.info("Data collection status was requested by the client:", this.currentStatus)
        return this.currentStatus
    }

    async triggerCollection(offline: boolean, event: CancellationToken) {
        this.logger.info("Triggering vRO server data collection...")
        this.environment.workspaceFolders.forEach(workspaceFolder => {
            this.workspaceCollection.triggerCollectionAndRefresh(workspaceFolder)
        })

        this.restClient
            .getVersion()
            .then(res => {
                this.logger.info(`Connected to vRO. Version: ${res.version}`)

                this.currentStatus = new CollectionStatus()
                let promise = Promise.resolve()
                const operations = [this.collectModulesAndActions, this.collectObjects, this.done]

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
            })
            .catch(error => {
                this.logger.info("Could not connect to vRO. Collecting data from local JS files in the project...")
                this.logger.error(error)
                this.currentStatus.finished = true
                this.hints.initialize()
            })
    }

    async getModulesAndActions() {
        this.logger.info("Collecting Modules and Actions...")
        const modules: HintModule[] = (await this.restClient.getRootCategories("ScriptModuleCategory")).map(module => {
            return {
                id: module.id,
                name: module.name,
                actions: []
            }
        })
        await Promise.all(
            modules.map(
                async module =>
                    (module.actions = await this.restClient.getChildrenOfCategoryWithDetails(module.id).then(actions =>
                        actions.map(action => {
                            return {
                                id: action.id,
                                name: action.name,
                                version: action.version,
                                description: action.description,
                                returnType: action.returnType,
                                parameters: action.parameters
                            } as HintAction
                        })
                    ))
            )
        )
        this.logger.info("Modules and Actions collected from vRO")
        return modules
    }

    collectModulesAndActions() {
        this.getModulesAndActions()
            .then(modules => {
                this.hints.collectModulesAndActions(modules)
            })
            .catch(error => {
                this.logger.info(`Error occurred: ${error}`)
            })
    }

    collectObjects() {
        this.getVroObjects()
            .then(objects => {
                this.hints.collectVroObjects(objects)
            })
            .catch(error => {
                this.logger.info(`Error occurred: ${error}`)
            })
    }

    async getVroObjects() {
        this.logger.info("Collecting vRO objects...")

        let objects = {}
        try {
            objects = await this.restClient.getVroServerData()
        } catch (error) {
            this.logger.error(error)
        }
        const plugins: HintPlugin[] = objects["plugins"]
        const allObjects: vmw.pscoe.hints.IClass[] = []
        const regex = new RegExp(/\/plugins\/([a-zA-Z0-9\_\-\.\/]+)/)

        if (!plugins || plugins.length < 1) {
            this.logger.error("No vRO objects found")
        } else {
            for (const plugin of plugins) {
                const link = RegExp(regex).exec(plugin.detailsLink)
                if (!link) {
                    throw new Error(`No plugin details found`)
                }

                const parsedLink = link[0].substring(9).toString() // always retrieve and parse the first occurrence
                const pluginDetails = await this.restClient.getPluginDetails(parsedLink)

                for (const pluginObject of pluginDetails["objects"]) {
                    const object: vmw.pscoe.hints.IClass = {
                        name: pluginObject["name"]
                    }
                    allObjects.push(object)
                }
            }
            this.logger.info(`Objects collected from vRO`)
        }
        return allObjects
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
