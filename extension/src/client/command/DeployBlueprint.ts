/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import { AutoWire, Logger, validate, VraNgRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../system"
import { VraIdentityStore } from "../storage"
import { BaseVraCommand } from "./BaseVraCommand"
import { IdentityQuickPickItem, MultiStepInput } from "../ui/MultiStepInput"
import { QuickInputStep, QuickPickStep, StepNode, StepState } from "../ui/MultiStepMachine"

interface State {
    projectId: string
    deploymentName: string
}

@AutoWire
export class DeployBlueprint extends BaseVraCommand {
    private readonly logger = Logger.get("DeployBlueprint")

    get commandId(): string {
        return Commands.DeployBlueprint
    }

    constructor(env: EnvironmentManager, config: ConfigurationManager, identity: VraIdentityStore) {
        super(env, config, identity)
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command DeployBlueprint")

        const activeTextEditor = vscode.window.activeTextEditor
        if (!activeTextEditor) {
            vscode.window.showErrorMessage("There is no opened file in the editor")
            return
        }

        if (activeTextEditor.document.languageId !== "yaml") {
            vscode.window.showErrorMessage("The currently opened file is not a YAML file")
            return
        }

        const restClient = await this.getRestClient()

        const blueprintContent = activeTextEditor.document.getText()
        const blueprintName = path.basename(activeTextEditor.document.fileName).replace(".yaml", "")
        const existingBlueprint = await restClient.getBlueprintByName(blueprintName)

        if (existingBlueprint) {
            const deploymentName = await vscode.window.showInputBox({
                ignoreFocusOut: true,
                prompt: "Provide a deployment name",
                validateInput: val => validate.isNotEmpty("Deployment name")(val)[1]
            })

            if (!deploymentName) {
                this.logger.info("No deployment name was provided")
                return
            }

            await restClient.updateBlueprint(existingBlueprint.id, {
                name: existingBlueprint.name,
                projectId: existingBlueprint.projectId,
                content: blueprintContent
            })

            return this.doDeploy(restClient, existingBlueprint.projectId, deploymentName, existingBlueprint.id)
        }

        const state = { projectId: "", deploymentName: "" }
        const multiStep = new MultiStepInput("Deploy blueprint", context, this.config)
        await multiStep.run(this.buildStepTree(restClient), state)

        this.logger.debug("Selected project and deployment name: ", state)

        if (!state.projectId) {
            return Promise.reject("No project was selected")
        }

        if (!state.deploymentName) {
            return Promise.reject("No deployment name was provided")
        }

        return this.doDeploy(restClient, state.projectId, state.deploymentName, undefined, blueprintContent)
    }

    private buildStepTree(restClient: VraNgRestClient): StepNode<QuickPickStep> {
        const rootNode: StepNode<QuickPickStep> = {
            value: new VraProjectPickStep(restClient),
            next: () => deploymentNameNode
        }

        const deploymentNameNode: StepNode<QuickInputStep> = {
            value: new DeploymentNameInputStep(),
            parent: rootNode,
            next: () => undefined
        }

        return rootNode
    }

    async doDeploy(
        restClient: VraNgRestClient,
        projectId: string,
        deploymentName: string,
        blueprintId?: string,
        content?: string
    ): Promise<void> {
        const deploymentId = (
            await restClient.deployBlueprint({
                blueprintId,
                projectId,
                content,
                deploymentName
            })
        ).deploymentId

        vscode.window
            .showInformationMessage(`Deployment '${deploymentName}' has started`, "Open deployment", "Copy URL")
            .then(selection => {
                const host = this.config.vrdev.vra.auth.host
                const port = this.config.vrdev.vra.auth.port
                const url = `https://${host}:${port}/automation-ui/#/deployment-ui;ash=%2Fdeployment%2F${deploymentId}`

                if (selection == "Open deployment") {
                    // bug: https://github.com/microsoft/vscode/issues/85930
                    vscode.env.openExternal(vscode.Uri.parse(url))
                } else if (selection == "Copy URL") {
                    vscode.env.clipboard.writeText(url)
                }
            })
    }
}

class VraProjectPickStep implements QuickPickStep {
    matchOnDescription?: boolean = false
    matchOnDetail?: boolean = false
    multiselect: boolean = false
    placeholder: string = "Pick a project"
    title = "Deploy blueprint"

    constructor(private restClient: VraNgRestClient) {
        // empty
    }

    get items(): Promise<IdentityQuickPickItem[]> {
        return this.restClient.getProjects().then(projects => {
            return projects.map(project => {
                return {
                    id: project.id,
                    name: project.name,
                    label: `$(organization) ${project.name}`,
                    description: project.description
                }
            })
        })
    }

    updateState(state: StepState<State>, selection: IdentityQuickPickItem[]): void {
        state.projectId = selection[0].id
    }
}

class DeploymentNameInputStep implements QuickInputStep {
    placeholder: string = "Provide a deployment name"
    validate = validate.isNotEmpty("Deployment name")
    title = "Deploy blueprint"

    updateState(state: StepState<State>, selection: string): void {
        state.deploymentName = selection
    }
}
