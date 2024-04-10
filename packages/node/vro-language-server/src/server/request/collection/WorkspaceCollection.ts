/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as os from "os"
import * as path from "path"

import {
    ActionParameters,
    AutoWire,
    HintAction,
    HintModule,
    Logger,
    PomFile,
    WorkspaceFolder
} from "@vmware/vrdt-common"
import { parse } from "comment-parser"
import * as fs from "fs-extra"
import * as _ from "lodash"
import * as protobuf from "protobufjs"
import { v4 as uuidv4 } from "uuid"
import { FileChangeType } from "vscode-languageserver"

import { ActionsPackProto, Timeout } from "../../../constants"
import { Environment, FileChangeEventParams, HintLookup, WorkspaceFilesWatcher } from "../../core"
import { FileSavedEventParams, WorkspaceDocumentWatcher } from "../../core/WorkspaceDocumentWatcher"

@AutoWire
export class WorkspaceCollection {
    private readonly logger = Logger.get("WorkspaceCollection")
    private readonly debounceTriggerCollection = _.debounce(this.triggerCollectionAndRefresh, Timeout.ONE_SECOND)

    constructor(
        private environment: Environment,
        private hints: HintLookup,
        workspaceFilesWatcher: WorkspaceFilesWatcher,
        workspaceDidSaveDocumentWatcher: WorkspaceDocumentWatcher
    ) {
        this.logger.info("Workspace collection constructor")
        workspaceFilesWatcher.onDidChangeWatchedFiles(this.onWorkspaceFilesChanged.bind(this))
        workspaceDidSaveDocumentWatcher.onDidSaveWatchedFiles(this.onWorkspaceFilesSave.bind(this))
    }

    private async onWorkspaceFilesChanged(event: FileChangeEventParams): Promise<void> {
        for (const change of event.changes) {
            if (!change.workspaceFolder) {
                this.logger.warn("Could not trigger collection. Empty workspace folder in change event.", change)
                continue
            }

            if (change.type === FileChangeType.Created || change.type === FileChangeType.Deleted) {
                this.debounceTriggerCollection(change.workspaceFolder)
            }
        }
    }

    private async onWorkspaceFilesSave(event: FileSavedEventParams): Promise<void> {
        for (const change of event.changes) {
            if (!change.workspaceFolder) {
                this.logger.warn("Could not trigger collection. Empty workspace folder in change event.", change)
                continue
            }

            this.debounceTriggerCollection(change.workspaceFolder)
        }
    }

    async triggerCollectionAndRefresh(workspaceFolder: WorkspaceFolder): Promise<void> {
        await this.triggerCollection(workspaceFolder)
        // workspace collection
        this.hints.refreshForWorkspace(workspaceFolder)
    }

    private async triggerCollection(workspaceFolder: WorkspaceFolder): Promise<void> {
        this.logger.info("Triggering workspace collection...")
        const modules: string[] = []
        const outputDir = this.environment.resolveHintsDir(workspaceFolder)

        this.getModulesForCollection(workspaceFolder, undefined, modules)
        if (modules.length === 0) {
            this.logger.debug("Skipping workspace collection as there are no JS action modules in the project")
            return
        }

        const fullPath = path.join(workspaceFolder.uri.fsPath, modules.join(","))
        const modulesPath = path.join(fullPath, "src/main/resources")
        try {
            const payload = this.collectLocalData(modulesPath)
            this.generateActionsPbFiles(payload, outputDir, workspaceFolder)
        } catch (error) {
            this.logger.warn(`Error occurred: ${JSON.stringify(error)}`)
        }
        this.logger.info("Workspace hint collection has finished")
    }

    private generateActionsPbFiles(payload: any, outputDir: string, workspaceFolder: WorkspaceFolder) {
        this.logger.info("Generating actions protobuf files...")

        const outputFile = path.join(outputDir, "actions.pb")
        const actionPackDir = this.environment.resolveProtoDir(workspaceFolder)
        const actionPackProtoFile = path.join(actionPackDir, "actions-pack.proto")

        fs.writeFileSync(actionPackProtoFile, ActionsPackProto)

        protobuf.load(actionPackProtoFile, function (err, root) {
            if (err) throw err
            if (!root) throw new Error("Root namespace not loaded")

            // Obtain a message type
            const ActionsPack = root.lookupType("vmw.pscoe.hints.ActionsPack")

            // Verify the payload (i.e. incomplete or invalid)
            const errMsg = ActionsPack.verify(payload)
            if (errMsg) throw Error(errMsg)

            // Create a new message
            const message = ActionsPack.create(payload)

            // Encode a message to a Buffer
            const buffer = ActionsPack.encode(message).finish()

            fs.writeFileSync(outputFile, buffer)
        })
    }

    collectLocalData(modulesPath: string): any {
        this.logger.info(`Collecting data from .js files in: ${modulesPath}`)

        const modules: HintModule[] = []
        const actions: HintAction[] = []
        const filesArray = this.readJsFiles(modulesPath, [])

        filesArray.forEach(action => {
            const actionLines = action.split("\n")
            const actionName = path.parse(actionLines[0]).name
            const actionPath = path.parse(actionLines[0]).dir
            const parsedActions = parse(action)
            const parameters: ActionParameters[] = []
            let returnType = ""
            const separator = os.platform() == "win32" ? "\\" : "/"
            const moduleName = actionPath
                .split(`src${separator}main${separator}resources${separator}`)[1]
                .replace(/^[\/\\]/, "") // remove leading slash or backslash
                .replace(/[\/\\]$/, "") // remove trailing slash or backslash
                .replace(/[\/\\]/g, ".") // replace remaining slashes or backslashes with dots

            parsedActions[0]?.tags.forEach(tag => {
                if (tag.tag === "param") {
                    const actionParams: ActionParameters = {
                        name: tag.name,
                        type: tag.type,
                        description: tag?.description
                    }
                    parameters.push(actionParams)
                }
                if (tag.tag === "return") {
                    returnType = tag.type
                }
            })

            const actionObj: HintAction = {
                id: actionName,
                name: actionName,
                moduleName: moduleName,
                returnType: returnType,
                description: parsedActions[0]?.description,
                parameters: parameters
            }
            actions.push(actionObj)

            const isModuleInArray = modules.some(module => module.name === moduleName)
            if (!isModuleInArray) {
                const newModule: HintModule = {
                    id: moduleName,
                    name: moduleName,
                    actions: []
                }
                modules.push(newModule)
            }
        })

        modules.forEach(module => {
            actions.forEach(action => {
                if (action.moduleName === module.name) {
                    module.actions.push(action)
                }
            })
        })

        const payload = {
            version: 1,
            uuid: uuidv4(),
            metadata: {
                timestamp: Date.now(),
                serverName: "",
                serverVersion: "0.0.1",
                hintingVersion: "0.0.1"
            },
            modules: modules
        }

        return payload
    }

    // Recursively search for .js files in a directory
    readJsFiles(dir: string, fileList: string[]): string[] {
        const files = fs.readdirSync(dir)
        fileList = fileList || []

        files.forEach(file => {
            const filePath = path.join(dir, file)

            if (fs.statSync(filePath).isDirectory()) {
                // If the file is a directory, recursively call readJsFiles on it
                fileList = this.readJsFiles(filePath, fileList)
            } else if (filePath.endsWith(".js")) {
                // If the file is a .js file, read its contents and add to the array
                const content = `${filePath}\n${fs.readFileSync(filePath, "utf8")}`
                fileList.push(content)
            }
        })
        return fileList
    }

    private getModulesForCollection(folder: WorkspaceFolder, subfolder: string | undefined, modules: string[]): void {
        const pomFilePath = path.join(folder.uri.fsPath, subfolder || "", "pom.xml")

        if (!fs.existsSync(pomFilePath)) {
            throw new Error(`Missing pom.xml in workspace ${folder.name}${subfolder ? `/${subfolder}` : ""}`)
        }

        const pomFile = new PomFile(pomFilePath)

        if (pomFile.isBase && pomFile.modules.length > 0) {
            pomFile.modules.forEach(module => {
                this.getModulesForCollection(folder, module, modules)
            })
        }

        if (!!subfolder && pomFile.parentId === "com.vmware.pscoe.o11n:actions-package") {
            modules.push(subfolder)
        }
    }
}
