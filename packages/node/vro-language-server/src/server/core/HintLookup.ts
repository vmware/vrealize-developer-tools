/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as fs from "fs"

import { AutoWire, HintModule, Logger, WorkspaceFolder } from "@vmware/vrdt-common"
import * as _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { Disposable, WorkspaceFoldersChangeEvent } from "vscode-languageserver"

import { vmw } from "../../proto"
import { ConfigurationWatcher } from "./ConfigurationWatcher"
import { Environment } from "./Environment"
import { Initializer } from "./Initializer"
import { WorkspaceFoldersWatcher } from "./WorkspaceFoldersWatcher"

@AutoWire
export class ClassFilter {
    isInstantiable: boolean | undefined = undefined
}

interface HintFileDecoder<T> {
    decode(buffer: Buffer): T
}

class HintStore<T> {
    local: Map<string, T[]> = new Map()
    global: T[] = []

    isEmpty(): boolean {
        return this.local.size === 0 && this.global.length === 0
    }
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
@AutoWire
export class HintLookup implements Disposable {
    private readonly logger = Logger.get("HintLookup")

    private scriptingApi: HintStore<vmw.pscoe.hints.ScriptingApiPack> = new HintStore()
    actions: any = new HintStore()
    private configs: HintStore<vmw.pscoe.hints.ConfigurationsPack> = new HintStore()
    private vroModulesAndActions: HintModule[]
    private vroObjects: vmw.pscoe.hints.IClass[]

    private subscriptions: Disposable[] = []

    constructor(
        private environment: Environment,
        configWatcher: ConfigurationWatcher,
        workspaceWatcher: WorkspaceFoldersWatcher,
        initializer: Initializer
    ) {
        this.subscriptions.push(
            configWatcher.onDidChangeConfiguration(this.onDidChangeConfiguration.bind(this)),
            workspaceWatcher.onDidChangeWorkspaceFolders(this.onDidChangeWorkspaceFolders.bind(this)),
            initializer.onInitialize(this.initialize.bind(this))
        )
    }

    dispose(): void {
        this.logger.debug("Disposing HintLookup")
        this.subscriptions.forEach(s => s && s.dispose())
    }

    getGlobalActionsPack() {
        const actionPack = {
            modules: this.vroModulesAndActions,
            uuid: uuidv4(),
            version: 1,
            toJSON: function (): { [k: string]: any } {
                return {}
            }
        }
        return actionPack
    }

    collectModulesAndActions(vroModulesAndActions: HintModule[]): void {
        this.vroModulesAndActions = vroModulesAndActions
    }

    collectVroObjects(vroObjects: vmw.pscoe.hints.IClass[]): void {
        this.vroObjects = vroObjects
    }

    getActionModules(workspaceFolder?: WorkspaceFolder): HintModule[] {
        if (this.vroModulesAndActions) {
            this.actions.global.push(this.getGlobalActionsPack())
        }

        const localModules = workspaceFolder
            ? _.flatMap(this.actions.local[workspaceFolder.uri.fsPath], pack => pack.modules)
            : []
        const globalModules = _.flatMap(this.actions.global, pack => pack.modules)
        return _.unionWith(localModules, globalModules, (x, y) => x.name === y.name)
    }

    getActionsIn(moduleName: string, workspaceFolder?: WorkspaceFolder): vmw.pscoe.hints.IAction[] {
        const module = this.getActionModules(workspaceFolder).find(module => module.name === moduleName)
        this.logger.debug(`Module hint: ${JSON.stringify(module, null, 4)}`)

        if (module?.actions) {
            return module.actions.filter((action: any) => !!action)
        }

        return []
    }

    getConfigCategories(workspaceFolder?: WorkspaceFolder): vmw.pscoe.hints.IConfigCategory[] {
        if (this.configs.isEmpty()) {
            return []
        }

        const localCategories = workspaceFolder
            // @ts-ignore
            ? _.flatMap(this.configs.local[workspaceFolder.uri.fsPath], pack => pack.categories)
            : []
        const globalCategories = _.flatMap(this.configs.global, pack => pack.categories)
        return _.unionWith(localCategories, globalCategories, (x, y) => x.path === y.path)
    }

    getConfigElementsIn(categoryPath: string, workspaceFolder?: WorkspaceFolder): vmw.pscoe.hints.IConfig[] {
        const module = this.getConfigCategories(workspaceFolder).find(category => category.path === categoryPath)

        if (module?.configurations) {
            return module.configurations.filter(config => !!config)
        }

        return []
    }

    getClasses(filter: ClassFilter): vmw.pscoe.hints.IClass[] {
        const result: vmw.pscoe.hints.IClass[] = []

        if (this.vroObjects) {
            result.push(...this.vroObjects)
        }

        for (const api of this.scriptingApi.global) {
            for (const cls of api.classes) {
                const hasConstructors = !!cls.constructors && cls.constructors.length > 0
                if (filter.isInstantiable === undefined || hasConstructors === filter.isInstantiable) {
                    result.push(cls)
                }
            }
        }

        return result
    }

    getFunctionSets(): vmw.pscoe.hints.IFunctionSet[] {
        const result: vmw.pscoe.hints.IFunctionSet[] = []

        for (const api of this.scriptingApi.global) {
            for (const fs of api.functionSets) {
                result.push(fs)
            }
        }

        return result
    }

    //
    // Event Handlers
    //

    initialize() {
        this.environment.workspaceFolders.forEach(this.load, this)
        this.load()
    }

    private onDidChangeConfiguration(): void {
        this.logger.debug("HintLookup.onDidChangeConfiguration()")
        this.load()
    }

    private onDidChangeWorkspaceFolders(event: WorkspaceFoldersChangeEvent): void {
        this.logger.debug("HintLookup.onDidChangeWorkspaceFolders()")
        for (const folder of event.added) {
            this.load(WorkspaceFolder.fromProtocol(folder))
        }
    }

    refreshForWorkspace(workspaceFolder: WorkspaceFolder): void {
        this.load(workspaceFolder)
    }

    //
    // Load proto files
    //

    private load(workspaceFolder?: WorkspaceFolder): void {
        const actionsFile = this.environment.resolveHintFile("actions.pb", workspaceFolder)
        if (actionsFile) {
            this.loadProtoInScope([actionsFile], workspaceFolder, this.actions, vmw.pscoe.hints.ActionsPack)
        }

        if (workspaceFolder) {
            const dependenciesHintsFiles = this.environment.resolveDependenciesHintFiles(workspaceFolder)
            if (dependenciesHintsFiles) {
                this.loadProtoInScope(
                    dependenciesHintsFiles,
                    workspaceFolder,
                    this.actions,
                    vmw.pscoe.hints.ActionsPack
                )
            }
        }

        const configsFile = this.environment.resolveHintFile("configs.pb", workspaceFolder)
        if (configsFile) {
            this.loadProtoInScope([configsFile], workspaceFolder, this.configs, vmw.pscoe.hints.ConfigurationsPack)
        }

        if (!workspaceFolder) {
            // plugins aren't located in workspace folder
            const coreApiFile = this.environment.resolveHintFile("core-api.pb", undefined)
            const pluginFiles = this.environment.resolvePluginHintFiles()

            if (coreApiFile) {
                pluginFiles.push(coreApiFile)
            }

            this.loadProtoInScope(pluginFiles, undefined, this.scriptingApi, vmw.pscoe.hints.ScriptingApiPack)
        }
    }

    private loadProtoInScope<T>(
        filenames: string[],
        scope: WorkspaceFolder | undefined,
        target: HintStore<T>,
        decoder: HintFileDecoder<T>
    ): void {
        if (filenames.length === 0) {
            return
        }

        const result: T[] = []
        filenames.forEach(file => {
            const hintPack = this.decodeProtoFile(file, decoder)
            if (hintPack) {
                result.push(hintPack)
            }
        })

        if (!scope) {
            target.global = result
        } else {
            // @ts-ignore
            target.local[scope.uri.fsPath] = result
        }
    }

    private decodeProtoFile<T>(filePath: string, decoder: HintFileDecoder<T>): T | null {
        this.logger.info(`Loading hint file '${filePath}'`)

        if (!fs.existsSync(filePath)) {
            this.logger.warn(`Hint file '${filePath}' does not exist`)
            return null
        }

        const buffer = fs.readFileSync(filePath)
        return decoder.decode(buffer)
    }
}
