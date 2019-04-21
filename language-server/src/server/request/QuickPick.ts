/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, VroElementPickInfo } from "vrealize-common"

import { remote, util } from "../../public"
import { ConnectionLocator, HintLookup } from "../core"

@AutoWire
export class QuickPick {
    private readonly logger = Logger.get("QuickPick")

    constructor(private hints: HintLookup, connectionLocator: ConnectionLocator) {
        connectionLocator.connection.onRequest(remote.server.giveActionModules, this.giveActionModules.bind(this))
        connectionLocator.connection.onRequest(remote.server.giveActionsForModule, this.giveActionsForModule.bind(this))
        connectionLocator.connection.onRequest(remote.server.giveAllActions, this.giveAllActions.bind(this))
        connectionLocator.connection.onRequest(remote.server.giveConfigCategories, this.giveConfigCategories.bind(this))
        connectionLocator.connection.onRequest(
            remote.server.giveConfigsForCategory,
            this.giveConfigsForCategory.bind(this)
        )
        connectionLocator.connection.onRequest(
            remote.server.giveAllConfigElements,
            this.giveAllConfigElements.bind(this)
        )
    }

    async giveActionModules() {
        this.logger.debug("Retrieving all action modules")
        const allModules = this.hints.getActionModules()
        return allModules.map(module => util.quickPick.ofModule(module))
    }

    async giveActionsForModule(moduleName: string) {
        this.logger.debug(`Retrieving all actions for module ${moduleName}`)
        const allActions = this.hints.getActionsIn(moduleName)
        return allActions.map(action => util.quickPick.ofActionInPath(action, moduleName))
    }

    async giveAllActions() {
        this.logger.debug("Retrieving all actions")
        const result: VroElementPickInfo[] = []
        const modules = this.hints.getActionModules()

        for (const module of modules) {
            if (!module || !module.name || !module.actions) {
                continue
            }

            for (const action of module.actions) {
                if (!action || !action.name) {
                    continue
                }

                result.push(util.quickPick.ofActionInModule(action, module))
            }
        }

        return result
    }

    async giveConfigCategories() {
        this.logger.debug("Retrieving all configuration categories")
        const allCategories = this.hints.getConfigCategories()
        return allCategories.map(category => util.quickPick.ofCategory(category))
    }

    async giveConfigsForCategory(categoryPath: string) {
        this.logger.debug(`Retrieving all configuration elements in category ${categoryPath}`)
        const allConfigurations = this.hints.getConfigElementsIn(categoryPath)
        return allConfigurations.map(action => util.quickPick.ofConfigInPath(action, categoryPath))
    }

    async giveAllConfigElements() {
        this.logger.debug("Retrieving all configuration elements")
        const result: VroElementPickInfo[] = []
        const categories = this.hints.getConfigCategories()

        for (const category of categories) {
            if (!category || !category.path || !category.configurations) {
                continue
            }

            for (const config of category.configurations) {
                if (!config || !config.name) {
                    continue
                }

                result.push(util.quickPick.ofConfigInCategory(config, category))
            }
        }

        return result
    }
}
