/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"
import * as jsonParser from "jsonc-parser"
import * as _ from "lodash"
import * as micromatch from "micromatch"
import { AutoWire, Logger, PomFile, TasksInfo } from "vrealize-common"
import * as vscode from "vscode"

import { extensionShortName } from "../../constants"
import { Registrable } from "../../Registrable"
import { TASKS_BY_TOOLCHAIN_PARENT, VrealizeTaskConfiguration } from "./DefaultTasksJson"
import { EnvironmentManager } from "../../system"
import { ScopedMemento } from "../../storage/ScopedMemento"

interface VrealizeTaskDefinition extends vscode.TaskDefinition {
    command: string
    label: string
}

@AutoWire
export class TaskProvider implements vscode.TaskProvider, Registrable {
    private readonly logger = Logger.get("TaskProvider")
    private ignoredTaskWarnings: ScopedMemento

    constructor(private env: EnvironmentManager) {
        // empty
    }

    dispose() {
        // empty
    }

    async provideTasks(token?: vscode.CancellationToken): Promise<vscode.Task[]> {
        const tasksConf = vscode.workspace.getConfiguration("vrdev").get<TasksInfo>("tasks")

        if ((tasksConf && tasksConf.disable === true) || !this.env.hasRelevantProject()) {
            return []
        }

        const workspaceFolders = vscode.workspace.workspaceFolders || []
        const excludePatterns = tasksConf ? tasksConf.exclude : []

        return _.flatMap(workspaceFolders, folder => {
            return this.tasksForWorkspace(folder, excludePatterns)
        })
    }

    resolveTask(task: vscode.Task, token?: vscode.CancellationToken): vscode.Task | undefined {
        // TODO: Let the user customize the task commands and parameters via local tasks.json
        // https://github.com/Microsoft/vscode/issues/33523
        return undefined
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the task provider")
        this.ignoredTaskWarnings = ScopedMemento.from(context.globalState, "ignoredTaskWarnings")

        const providerRegistration = vscode.tasks.registerTaskProvider(extensionShortName, this)
        context.subscriptions.push(this, providerRegistration)
    }

    private tasksForWorkspace(folder: vscode.WorkspaceFolder, excludePatterns: string[]) {
        const tasksFile = path.join(folder.uri.fsPath, ".vscode", "tasks.json")
        const tasks: VrealizeTaskDefinition[] = []

        if (fs.existsSync(tasksFile)) {
            const tasksContent = fs.readFileSync(tasksFile, { encoding: "utf8" })
            if (tasksContent) {
                jsonParser
                    .parse(tasksContent)
                    .tasks.filter((t: VrealizeTaskDefinition) => {
                        return t.type === extensionShortName
                    })
                    .forEach((t: VrealizeTaskDefinition) => {
                        tasks.push(t)
                    })
            }
        }

        try {
            this.includeDefaultTasks(folder, undefined, tasks, excludePatterns)
        } catch (e) {
            const msg = `Couldn't generate task list for workspace folder '${folder.uri.fsPath}'. Cause: ${e.message}`
            this.logger.warn(msg)
            this.showWarning(msg, folder.uri.fsPath)
        }

        return tasks.map(taskDef => this.newShellTask(taskDef, folder))
    }

    private includeDefaultTasks(
        folder: vscode.WorkspaceFolder,
        subfolder: string | undefined,
        tasks: VrealizeTaskDefinition[],
        excludePatterns: string[]
    ) {
        const pomFilePath = path.join(folder.uri.fsPath, subfolder || "", "pom.xml")

        if (!fs.existsSync(pomFilePath)) {
            throw new Error(`Missing pom.xml in workspace ${folder.name}${subfolder ? `/${subfolder}` : ""}`)
        }

        const pomFile = new PomFile(pomFilePath)

        if (!micromatch.any(`${pomFile.groupId}:${pomFile.artifactId}`, excludePatterns)) {
            const defaultTasks: VrealizeTaskConfiguration[] = TASKS_BY_TOOLCHAIN_PARENT[pomFile.parentId] || []

            for (const task of defaultTasks) {
                const clone = this.parseTaksDefinition(task)
                clone.label = `${clone.label} ${subfolder ? subfolder : pomFile.artifactId}`
                clone.command = subfolder ? `${clone.command} -pl ${subfolder}` : clone.command
                if (!tasks.find(elem => elem.label === clone.label || elem.label === `${clone.type}: ${clone.label}`)) {
                    tasks.push(clone)
                }
            }
        }

        if (pomFile.isBase && pomFile.modules.length > 0) {
            pomFile.modules.forEach(module => {
                const dirname = subfolder ? path.basename(path.dirname(pomFile.filePath)) : undefined
                this.includeDefaultTasks(folder, dirname ? `${dirname}/${module}` : module, tasks, excludePatterns)
            })
        }
    }

    private parseTaksDefinition(taskDef: VrealizeTaskConfiguration): VrealizeTaskDefinition {
        let command: string = taskDef.command
        if (process.platform === "win32" && taskDef.windows) {
            command = taskDef.windows.command
        } else if (process.platform === "darwin" && taskDef.osx) {
            command = taskDef.osx.command
        } else if (taskDef.linux) {
            command = taskDef.linux.command
        }
        return { type: extensionShortName, label: taskDef.label, command }
    }

    private newShellTask(taskDef: VrealizeTaskDefinition, workspaceFolder: vscode.WorkspaceFolder): vscode.Task {
        const shellExec = new vscode.ShellExecution(taskDef.command, { cwd: workspaceFolder.uri.fsPath })

        const task = new vscode.Task(taskDef, workspaceFolder, taskDef.label, taskDef.type, shellExec, [])
        task.group = vscode.TaskGroup.Build

        return task
    }

    private showWarning(message: string, workspaceFolderPath: string): void {
        if (this.ignoredTaskWarnings.get<boolean>(workspaceFolderPath) !== true) {
            vscode.window.showWarningMessage(message, "Ignore for Project").then(selected => {
                if (selected === "Ignore for Project") {
                    this.ignoredTaskWarnings.set(workspaceFolderPath, true)
                }
            })
        }
    }
}
