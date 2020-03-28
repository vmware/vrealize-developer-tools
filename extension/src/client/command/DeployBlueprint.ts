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
import { IdentityQuickPickItem, MultiStepInput, QuickPickParameters } from "../ui/MultiStepInput"

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
                validateInput: validate.isNotEmpty("Host")
            })

            if (!deploymentName) {
                this.logger.info("No deployment name was provided")
                return
            }

            await restClient.deployBlueprint({
                blueprintId: existingBlueprint.id,
                projectId: existingBlueprint.projectId,
                content: blueprintContent,
                deploymentName
            })

            return
        }

        const state = { projectId: "", deploymentName: "" }
        await MultiStepInput.run(input => this.pickProject(input, restClient, state))


        this.logger.debug("Selected project and deployment name: ", state)

        if (!state.projectId) {
            return Promise.reject("No project was selected")
        }

        if (!state.deploymentName) {
            return Promise.reject("No deployment name was provided")
        }

        await restClient.deployBlueprint({
            projectId: state.projectId,
            content: blueprintContent,
            deploymentName: state.deploymentName
        })
    }

    private async pickProject(
        input: MultiStepInput,
        restClient: VraNgRestClient,
        state: { projectId: string; deploymentName: string }
    ) {
        const projects: IdentityQuickPickItem[] = (await restClient.getProjects()).map(project => {
            return {
                id: project.id,
                name: project.name,
                label: `$(organization) ${project.name}`,
                description: project.description
            }
        })

        const pick = await input.showQuickPick<IdentityQuickPickItem, QuickPickParameters<IdentityQuickPickItem>>({
            title: "Deploy blueprint",
            step: 1,
            totalSteps: 2,
            placeholder: "Pick a project",
            items: projects,
            buttons: []
        })

        state.projectId = pick.id

        return (input: MultiStepInput) => this.inputDeploymentName(input, state)
    }

    private async inputDeploymentName(input: MultiStepInput, state: { projectId: string; deploymentName: string }) {
        state.deploymentName = await input.showInputBox({
            title: "Deploy blueprint",
            step: 2,
            totalSteps: 2,
            value: "",
            password: false,
            prompt: "Provide a deployment name",
            validate: validate.isNotEmptyAsync("Deployment name")
        })

        // end of steps
    }
}
