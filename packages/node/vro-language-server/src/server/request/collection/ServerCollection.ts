/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, HintAction, HintModule, HintPlugin, Logger, sleep, VroRestClient } from "@vmware/vrdt-common"
import { CancellationToken } from "vscode-languageserver"

import { Timeout } from "../../../constants"
import { vmw } from "../../../proto"
import { remote } from "../../../public"
import { ConnectionLocator, Environment, HintLookup, Settings } from "../../core"
import { WorkspaceCollection } from "./WorkspaceCollection"

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
        // fetch the root script module categories
        const modules: HintModule[] = (await this.restClient.getRootCategories("ScriptModuleCategory")).map(module => {
            return {
                id: module.id,
                name: module.name,
                actions: []
            }
        })
        // add delay between the 2 REST calls in order not to overload the vRO vco service cache
        // see also: https://kb.vmware.com/s/article/95783?lang=en_US
        await this.setDelay(Timeout.THREE_SECONDS)

        // Enrichment of category actions execution has to be executed in serial order for not to overload the vRO
        // see also: https://kb.vmware.com/s/article/95783?lang=en_US
        for (const module of modules) {
            await this.enrichHintModuleWithActions(module)
        }

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

    /**
     * Collect all vRO Scripting API (Plugin) objects like VcPlugin, ActiveDirectory, etc.
     * Function is asynchronous and usually take 5-10 mins since the full list of plugin details
     * is huge (approximately 370 000 lines of JSON definitions)
     *
     * @returns vmw.pscoe.hints.IClass[]
     */
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
                        name: pluginObject["name"],
                        description: pluginObject["description"],
                        constructors: pluginObject["constructors"],
                        properties: pluginObject["attributes"],
                        methods: pluginObject["methods"]
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

    private async setDelay(delayMs: number) {
        await sleep(delayMs)
    }

    private async enrichHintModuleWithActions(module: HintModule): Promise<HintModule> {
        const actions: HintAction[] = await this.restClient.getChildrenOfCategoryWithDetails(module.id)
        module.actions = actions

        return module
    }
}
