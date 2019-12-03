/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger, MavenCliProxy, ProjectPickInfo, ProjectType } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, Patterns } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../manager"
import { MultiStepInput, QuickPickParameters } from "../ui"
import { Command } from "./Command"

interface State extends ProjectPickInfo {
    title: string
    step: number
    totalSteps: number
}

const projectTypes: ProjectType[] = [
    {
        id: "vro-js",
        label: "vRO JavaScript-based",
        containsWorkflows: false,
        description: "A vRO project that contains only actions as JavaScript files."
    },
    {
        id: "vro-xml",
        label: "vRO XML-based",
        containsWorkflows: true,
        description: "A legacy vRO project that can contain any vRO content."
    },
    {
        id: "vro-mixed",
        label: "vRO Mixed",
        containsWorkflows: true,
        description: "A mixed project that contains a JS-based module and a XML-based module."
    },
    {
        id: "vra-yaml",
        label: "vRA 7.x",
        containsWorkflows: false,
        description: "A vRA project that contains content exported from a vRA instance."
    },
    {
        id: "vra-ng",
        label: "vRA 8.x",
        containsWorkflows: false,
        description: "A vRA project that contains content exported from a vRA instance."
    },
    {
        id: "vra-vro",
        label: "vRA 7.x and vRO",
        containsWorkflows: true,
        description: "A vRO Mixed project with an additional module for vRA content."
    }
]

@AutoWire
export class NewProject extends Command {
    private readonly logger = Logger.get("NewProject")
    private readonly state = {} as State
    private readonly title = "Create New Project"

    constructor(private environment: EnvironmentManager, private config: ConfigurationManager) {
        super()
    }

    get commandId(): string {
        return Commands.NewProject
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        const noTypeScriptProject = projectTypes.every(e => e.id !== "vro-ts")
        if (this.config.vrdev.experimental.typescript && noTypeScriptProject) {
            projectTypes.unshift({
                id: "vro-ts",
                label: "vRO TypeScript-based",
                containsWorkflows: false,
                description: "A vRO project that contains actions, workflows and configs as TypeScript files."
            })
        } else if (!this.config.vrdev.experimental.typescript && !noTypeScriptProject) {
            // remove the TS project from the list
            projectTypes.shift()
        }

        this.logger.info("Executing command New Project")
        await MultiStepInput.run(input => this.pickProjectType(input))
    }

    private async pickProjectType(input: MultiStepInput) {
        const pick = await input.showQuickPick<ProjectType, QuickPickParameters<ProjectType>>({
            title: this.title,
            step: 1,
            totalSteps: 3,
            placeholder: "Pick a project type",
            items: projectTypes,
            buttons: []
        })

        this.state.projectType = pick
        return (input: MultiStepInput) => this.inputGroupId(input)
    }

    private async inputGroupId(input: MultiStepInput) {
        this.state.groupId = await input.showInputBox({
            title: this.title,
            step: 2,
            totalSteps: 3 + (this.state.projectType.containsWorkflows ? 1 : 0),
            value: this.state.groupId || "",
            prompt: "Choose a group ID for the project - e.g. com.company.department.topic",
            validate: this.validateGroupId
        })
        return (input: MultiStepInput) => this.inputName(input)
    }

    private async inputName(input: MultiStepInput) {
        this.state.name = await input.showInputBox({
            title: this.title,
            step: 3,
            totalSteps: 3 + (this.state.projectType.containsWorkflows ? 1 : 0),
            value: this.state.name || "",
            prompt:
                "Choose a name for the project. If the name contains dashes, remember to " +
                "remove the dash from any folders under src/ to avoid build and test errors.",
            validate: this.validateName
        })
        return (input: MultiStepInput) => {
            if (this.state.projectType.containsWorkflows) {
                return this.inputWorkflowsPath(input)
            }

            return this.showSaveDialog(input)
        }
    }

    private async inputWorkflowsPath(input: MultiStepInput) {
        this.state.workflowsPath = await input.showInputBox({
            title: this.title,
            step: 4,
            totalSteps: 4,
            value: this.state.workflowsPath || "",
            prompt: "Choose a path for the workflows - e.g. Company/Topic/Project",
            validate: this.validateWorkflowsPath
        })
        return (input: MultiStepInput) => this.showSaveDialog(input)
    }

    private async showSaveDialog(input: MultiStepInput) {
        const uri = await vscode.window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            openLabel: "Create here"
        })

        if (uri && uri.length > 0) {
            this.state.destination = uri[0]
            this.generateProject()
        }
    }

    private generateProject() {
        vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Generating ${this.state.projectType.label} project`,
                cancellable: true
            },
            (progress, token) => {
                let canceled = false
                token.onCancellationRequested(() => {
                    this.logger.info("User canceled the 'New Project' operation")
                    canceled = true
                })

                return new Promise(async (resolve, reject) => {
                    if (!this.state.destination) {
                        reject("Destination folder was not selected")
                        return
                    }

                    if (!canceled) {
                        const maven = new MavenCliProxy(this.environment, this.config.vrdev.maven, this.logger)
                        await maven
                            .createProject(
                                this.state.projectType.id,
                                this.state.groupId,
                                this.state.name,
                                this.state.destination.fsPath,
                                this.state.projectType.containsWorkflows,
                                this.state.workflowsPath
                            )
                            .catch(reason => {
                                this.logger.error("An error occurred while generating the project.", reason)
                                reject(reason.message)
                                canceled = true
                            })
                    }

                    if (!canceled) {
                        const projectFolder = path.join(this.state.destination.fsPath, this.state.name)
                        vscode.commands.executeCommand(
                            "vscode.openFolder",
                            vscode.Uri.file(projectFolder),
                            vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
                        )
                    }
                    resolve()
                }).catch(reason => {
                    vscode.window.showErrorMessage(`Could not create a new project. \n\n${reason}`)
                })
            }
        )
    }

    private async validateName(value: string) {
        if (!Patterns.PomArtifactId.test(value)) {
            return "The project name should contain only letters, numbers, dashes and underscores"
        }

        return undefined
    }

    private async validateGroupId(value: string) {
        if (!Patterns.PomGroupId.test(value)) {
            return "The project group ID should contain only letters, numbers, dots, dashes and underscores"
        }

        return undefined
    }

    private async validateWorkflowsPath(value: string) {
        if (!value || value.trim() === "" || value.trim() === "/") {
            return "A workflows path is required when creating an XML or Mixed vRO project"
        }

        return undefined
    }
}
