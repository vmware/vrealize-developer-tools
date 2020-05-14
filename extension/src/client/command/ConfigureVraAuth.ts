/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AuthGrant, AutoWire, Logger, validate, VraAuthType, VraNgRestClient } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { ConfigurationManager } from "../system"
import { Command } from "./Command"
import { VraIdentityStore } from "../storage"
import { MultiStepInput } from "../ui/MultiStepInput"
import { QuickInputStep, QuickPickStep, StepNode, StepState } from "../ui/MultiStepMachine"

interface AuthPickState {
    grantType: VraAuthType
    done: boolean
    endpoint?: { host: string; port: number }
    refreshToken?: string
    orgId?: string
    username?: string
    password?: string
}

interface AuthTypeItem extends vscode.QuickPickItem {
    id: VraAuthType
}

@AutoWire
export class ConfigureVraAuth extends Command<void> {
    private readonly logger = Logger.get("ConfigureVraAuth")

    constructor(private config: ConfigurationManager, private identity: VraIdentityStore) {
        super()
    }

    get commandId(): string {
        return Commands.ConfigureVraAuth
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        this.logger.info("Executing command Configure vRA Authentication")

        const title = "Configure vRA authentication"
        const multiStep = new MultiStepInput(title, context, this.config)
        const state = {} as AuthPickState
        await multiStep.run(this.buildStepTree(title), state)

        if (!state.endpoint || !state.done) {
            this.logger.info("No endpoint was specified or command was canceled")
            return
        }

        const { host, port } = state.endpoint
        const restClient = new VraNgRestClient(host, port, this.identity)

        // clear stored identity since the user might have provided different credentials
        await this.identity.clear(host)

        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: `Authenticating against ${host}...`,
                cancellable: false
            },
            async () => {
                try {
                    const token = await restClient.login(
                        new AuthGrant(
                            state.grantType,
                            state.refreshToken,
                            undefined,
                            undefined,
                            state.username,
                            state.password,
                            state.orgId
                        )
                    )
                    this.logger.info(`Got access token that expires in ${token.expires_in}s`)
                    const user = await restClient.getLoggedInUser()
                    const msg = `Sucessfully authenticated against '${host}' as user '${user.username}'`
                    this.logger.info(msg)
                    vscode.window.showInformationMessage(msg)
                } catch (reason) {
                    const errorMessage = `Could not authenticate against '${host}'. Reason: ${reason}`
                    this.logger.error(errorMessage)
                    throw new Error(errorMessage)
                }
            }
        )
    }

    private buildStepTree(title: string): StepNode<QuickInputStep> {
        //                        --> refresh token
        // endpoint --> auth type |
        //                        --> username --> password --> orgId

        const rootNode: StepNode<QuickInputStep> = {
            value: new VraHostInputStep(title, this.config),
            next: () => authTypeNode
        }

        const authTypeNode: StepNode<QuickPickStep> = {
            value: new AuthTypePickStep(title, this.config),
            parent: rootNode,
            next: (state: AuthPickState, selection?: AuthTypeItem[]) => {
                if (selection) {
                    const selected = selection[0].id
                    return selected === "refresh_token" ? refreshTokenNode : usernameNode
                }

                return state.grantType === "refresh_token" ? refreshTokenNode : usernameNode
            }
        }

        const refreshTokenNode: StepNode<QuickInputStep> = {
            value: new RefreshTokenInputStep(title),
            parent: authTypeNode,
            next: () => undefined
        }

        const usernameNode: StepNode<QuickInputStep> = {
            value: new UsernameInputStep(title),
            parent: authTypeNode,
            next: () => passwordNode
        }

        const passwordNode: StepNode<QuickInputStep> = {
            value: new PasswordInputStep(title),
            parent: usernameNode,
            next: () => orgIdNode
        }

        const orgIdNode: StepNode<QuickInputStep> = {
            value: new OrgIdInputStep(title),
            parent: passwordNode,
            next: () => undefined
        }

        return rootNode
    }
}

class VraHostInputStep implements QuickInputStep {
    placeholder = "Provide a vRA host and optional port"
    value = "www.mgmt.cloud.vmware.com"
    validate = validate.isNotEmpty("Host")

    constructor(public title: string, private config: ConfigurationManager) {
        // empty
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        const host = this.config.vrdev.vra.auth.host
        const port = this.config.vrdev.vra.auth.port

        this.value = `${host}${port != 443 ? `:${port}` : ""}`

        if (host != undefined && host.trim() != "") {
            state.endpoint = { host, port }
            return true
        }

        return false
    }

    async updateState(state: StepState<AuthPickState>, selection: string): Promise<void> {
        const [host, port] = selection.split(":")

        await vscode.workspace
            .getConfiguration("vrdev.vra.auth")
            .update("host", host, vscode.ConfigurationTarget.Workspace)

        await vscode.workspace
            .getConfiguration("vrdev.vra.auth")
            .update("port", port, vscode.ConfigurationTarget.Workspace)

        state.endpoint = { host, port: parseInt(port, 10) }
        this.value = `${host}${state.endpoint.port ? `:${state.endpoint.port}` : ""}`
    }
}

class AuthTypePickStep implements QuickPickStep {
    matchOnDescription?: boolean = false
    matchOnDetail?: boolean = false
    multiselect: boolean = false
    placeholder: string = "Pick an authentication method"
    selectedItems?: AuthTypeItem[] = undefined
    items: AuthTypeItem[] = [
        {
            id: "refresh_token",
            label: "$(key) Refresh Token",
            description: "An API Token issued by vRA Cloud or vRA v8.x on-prem"
        },
        {
            id: "password",
            label: "$(account) Username and password",
            description: "User credentials to authenticate towards vRA Cloud or vRA 8.x on-prem."
        }
    ]

    constructor(public title: string, private config: ConfigurationManager) {
        // empty
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        const authType = this.config.vrdev.vra.auth.type
        if (authType) {
            state.grantType = authType
            return true
        }

        return false
    }

    async updateState(state: StepState<AuthPickState>, selection: AuthTypeItem[]): Promise<void> {
        state.grantType = selection[0].id

        await vscode.workspace
            .getConfiguration("vrdev.vra.auth")
            .update("type", state.grantType, vscode.ConfigurationTarget.Workspace)
    }
}

class RefreshTokenInputStep implements QuickInputStep {
    prompt: string =
        "A token is obtained using the vRA Cloud portal (go to My Account -> API Tokens) " +
        "or through the vRA On-Prem (v8.x) REST API."
    placeholder = "Provide a vRA refresh token."
    validate = validate.isNotEmpty("Refresh Token")
    maskChars = true

    constructor(public title: string) {
        // empty
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        return state.grantType != "refresh_token"
    }

    updateState(state: StepState<AuthPickState>, selection: string): void {
        state.refreshToken = selection
        state.done = true
    }
}

class UsernameInputStep implements QuickInputStep {
    placeholder: string = "Provide a username"
    validate = validate.isNotEmpty("Username")

    constructor(public title: string) {
        // empty
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        return state.grantType != "password"
    }

    updateState(state: StepState<AuthPickState>, selection: string): void {
        state.username = selection
    }
}

class PasswordInputStep implements QuickInputStep {
    placeholder: string = "Provide a password"
    maskChars = true
    validate = validate.isNotEmpty("Password")

    constructor(public title: string) {
        // empty
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        return state.grantType != "password"
    }

    updateState(state: StepState<AuthPickState>, selection: string): void {
        state.password = selection
    }
}

class OrgIdInputStep implements QuickInputStep {
    prompt: string =
        "Provide a vRA organization ID for vRA Cloud or domain for vRA On-Prem (v8.x)." +
        " Leave empty to use the default organization/domain."
    placeholder: string = "Provide an Organization ID or Domain"

    constructor(public title: string) {
        // empty
    }

    validate(value: string | undefined): [boolean, undefined] {
        return [true, undefined]
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        return state.grantType != "password"
    }

    updateState(state: StepState<AuthPickState>, selection: string): void {
        state.orgId = selection
        state.done = true
    }
}
