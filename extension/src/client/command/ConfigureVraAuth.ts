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
import { QuickInputStep, QuickPickStep, StepState } from "../ui/MultiStepMachine"

interface AuthPickState {
    grantType: VraAuthType
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

        const providedHost = await this.inputHost()
        if (!providedHost) {
            this.logger.info("No host was specified")
            return
        }

        const { host, port } = providedHost
        const restClient = new VraNgRestClient(host, port, this.identity)

        // clear stored identity so the user can re-enter
        await this.identity.clear(host)

        const title = `Configure vRA authentication: ${host}`
        const multiStep = new MultiStepInput(title, context, this.config)
        const state = {} as AuthPickState
        await multiStep.run(
            [
                new AuthTypePickStep(title, this.config),
                new RefreshTokenInputStep(title),
                new UsernameInputStep(title),
                new PasswordInputStep(title),
                new OrgIdInputStep(title)
            ],
            state
        )

        return restClient
            .login(
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
            .then(token => {
                this.logger.info(`Got access token that expires in ${token.expires_in}s`)
                return restClient.getLoggedInUser()
            })
            .then(user => {
                const msg = `Sucessfully authenticated at '${host}' as user '${user.username}'`
                this.logger.info(msg)
                vscode.window.showInformationMessage(msg, {})
            })
            .catch(reason => {
                const msg = `Could not authenticate towards '${host}'. Reason: ${reason}`
                this.logger.error(msg)
                vscode.window.showErrorMessage(msg)
            })
    }

    private async inputHost(): Promise<{ host: string; port: number } | undefined> {
        const host = this.config.vrdev.vra.auth.host
        const port = this.config.vrdev.vra.auth.port

        if (!host) {
            const hostAndPort = await vscode.window.showInputBox({
                ignoreFocusOut: true,
                value: "www.mgmt.cloud.vmware.com",
                prompt: "Provide a vRA host and optional port",
                valueSelection: undefined,
                validateInput: val => validate.isNotEmpty("Host")(val)[1]
            })

            if (!hostAndPort) {
                return undefined
            }

            const [host, port] = hostAndPort.split(":")

            await vscode.workspace
                .getConfiguration("vrdev.vra.auth")
                .update("host", host, vscode.ConfigurationTarget.Workspace)

            await vscode.workspace
                .getConfiguration("vrdev.vra.auth")
                .update("port", port, vscode.ConfigurationTarget.Workspace)

            return { host, port: parseInt(port, 10) }
        }

        return { host, port }
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
            description: "A vRO project that contains only actions as JavaScript files."
        },
        {
            id: "password",
            label: "$(account) Username and password",
            description: "A legacy vRO project that can contain any vRO content."
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

    async complete(state: StepState<AuthPickState>, selection: AuthTypeItem[]): Promise<void> {
        state.grantType = selection[0].id

        await vscode.workspace
            .getConfiguration("vrdev.vra.auth")
            .update("type", state.grantType, vscode.ConfigurationTarget.Workspace)
    }
}

class RefreshTokenInputStep implements QuickInputStep {
    placeholder: string = "Provide a vRA refresh token"
    validate = validate.isNotEmpty("Refresh Token")

    constructor(public title: string) {
        // empty
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        return state.grantType != "refresh_token"
    }

    complete(state: StepState<AuthPickState>, selection: string): void {
        state.refreshToken = selection
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

    complete(state: StepState<AuthPickState>, selection: string): void {
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

    complete(state: StepState<AuthPickState>, selection: string): void {
        state.password = selection
    }
}

class OrgIdInputStep implements QuickInputStep {
    placeholder: string = "Provide a vRA organization ID"

    constructor(public title: string) {
        // empty
    }

    validate(value: string | undefined): [boolean, undefined] {
        return [true, undefined]
    }

    shouldSkip(state: StepState<AuthPickState>): boolean {
        return state.grantType != "password"
    }

    complete(state: StepState<AuthPickState>, selection: string): void {
        state.orgId = selection
    }
}
