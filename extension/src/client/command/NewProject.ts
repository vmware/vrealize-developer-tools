/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger, MavenCliProxy, ProjectPickInfo, ProjectType } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, Patterns } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../system"
import { MultiStepInput } from "../ui/MultiStepInput"
import { Command } from "./Command"
import { QuickInputStep, QuickPickStep, StepNode, StepState } from "../ui/MultiStepMachine"

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

const TITLE = "Create New Project"

@AutoWire
export class NewProject extends Command<void> {
    private readonly logger = Logger.get("NewProject")
    private readonly state = {} as State

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
        const multiStep = new MultiStepInput(TITLE, context, this.config)
        await multiStep.run(this.buildStepTree(), this.state)

        if (this.state.completed) {
            await this.showSaveDialog()
        }
    }

    private buildStepTree(): StepNode<QuickPickStep> {
        const rootNode: StepNode<QuickPickStep> = {
            value: new ProjectTypePickStep(),
            next: () => groupIdNode
        }

        const groupIdNode: StepNode<QuickInputStep> = {
            value: new GroupIdInputStep(),
            parent: rootNode,
            next: () => projectNameNode
        }

        const projectNameNode: StepNode<QuickInputStep> = {
            value: new ProjectNameInputStep(),
            parent: groupIdNode,
            next: (state: State, selection?: string) => {
                return state.projectType.containsWorkflows ? workflowsPathNode : undefined
            }
        }

        const workflowsPathNode: StepNode<QuickInputStep> = {
            value: new WorkflowsPathInputStep(),
            parent: projectNameNode,
            next: () => undefined
        }

        return rootNode
    }

    private async showSaveDialog() {
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
}

class ProjectTypePickStep implements QuickPickStep {
    matchOnDescription?: boolean = false
    matchOnDetail?: boolean = false
    multiselect: boolean = false
    placeholder: string = "Pick a project type"
    items: ProjectType[] = projectTypes
    title = TITLE

    constructor() {
        // empty
    }

    updateState(state: StepState<State>, selection: ProjectType[]): void {
        state.projectType = selection[0]
    }
}

class GroupIdInputStep implements QuickInputStep {
    placeholder = "Choose a group ID for the project - e.g. com.company.department.topic"
    title = TITLE

    updateState(state: StepState<State>, selection: string): void {
        state.groupId = selection
    }

    validate(value: string | undefined): [boolean, string | undefined] {
        if (!value) {
            return [false, "The project group ID is required"]
        }

        if (!Patterns.PomGroupId.test(value)) {
            return [false, "The project group ID should contain only letters, numbers, dots, dashes and underscores"]
        }
        return [true, undefined]
    }
}

class ProjectNameInputStep implements QuickInputStep {
    title = TITLE
    placeholder =
        "Choose a name for the project. If the name contains dashes, remember to " +
        "remove the dash from any folders under src/ to avoid build and test errors."

    updateState(state: StepState<State>, selection: string): void {
        state.name = selection
    }

    validate(value: string | undefined): [boolean, string | undefined] {
        if (!value) {
            return [false, "The project group ID is required"]
        }

        if (!Patterns.PomArtifactId.test(value)) {
            return [false, "The project name should contain only letters, numbers, dashes and underscores"]
        }
        return [true, undefined]
    }
}

class WorkflowsPathInputStep implements QuickInputStep {
    placeholder = "Choose a path for the workflows - e.g. Company/Topic/Project"
    title = TITLE

    updateState(state: StepState<State>, selection: string): void {
        state.workflowsPath = selection
        state.completed = true
    }

    shouldSkip(state: StepState<State>): boolean {
        const shouldSkip = !state.projectType?.containsWorkflows
        if (shouldSkip) {
            state.completed = true
            return true
        }

        return false
    }

    validate(value: string | undefined): [boolean, string | undefined] {
        if (!value || value.trim() === "" || value.trim() === "/") {
            return [false, "A workflows path is required when creating an XML or Mixed vRO project"]
        }

        return [true, undefined]
    }
}
