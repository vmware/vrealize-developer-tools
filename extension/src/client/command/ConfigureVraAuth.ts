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
import { MultiStepInput, QuickPickParameters } from "../ui/MultiStepInput"

interface AuthPickState {
    title: string
    step: number
    totalSteps: number
    grantType: VraAuthType
    refreshToken?: string
    orgId?: string
    username?: string
    password?: string
}

interface AuthTypeItem extends vscode.QuickPickItem {
    id: VraAuthType
}

const authTypes: AuthTypeItem[] = [
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

@AutoWire
export class ConfigureVraAuth extends Command<void> {
    private readonly logger = Logger.get("ConfigureVraAuth")
    private pickState = {} as AuthPickState
    private title: string

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

        this.pickState = {} as AuthPickState
        this.title = `Configure vRA authentication: ${host}`

        await MultiStepInput.run(input => this.pickAuthType(input))

        return restClient
            .login(
                new AuthGrant(
                    this.pickState.grantType,
                    this.pickState.refreshToken,
                    undefined,
                    undefined,
                    this.pickState.username,
                    this.pickState.password,
                    this.pickState.orgId
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
                validateInput: validate.isNotEmpty("Host")
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

    private async pickAuthType(input: MultiStepInput) {
        const authType = this.config.vrdev.vra.auth.type

        if (!authType) {
            const pick = await input.showQuickPick<AuthTypeItem, QuickPickParameters<AuthTypeItem>>({
                title: this.title,
                step: 1,
                totalSteps: 2,
                placeholder: "Pick an authentication method",
                items: authTypes,
                buttons: []
            })

            this.pickState.grantType = pick.id

            await vscode.workspace
                .getConfiguration("vrdev.vra.auth")
                .update("type", pick.id, vscode.ConfigurationTarget.Workspace)
        } else {
            this.pickState.grantType = authType
        }

        return (input: MultiStepInput) => {
            if (this.pickState.grantType == "password") {
                return this.inputUsername(input)
            }

            return this.inputRefreshToken(input)
        }
    }

    private async inputRefreshToken(input: MultiStepInput) {
        this.pickState.refreshToken = await input.showInputBox({
            title: this.title,
            step: 3,
            totalSteps: 3,
            value: "",
            password: false,
            prompt: "Provide a vRA refresh token",
            validate: validate.isNotEmptyAsync("Refresh Token")
        })

        // end of steps
    }

    private async inputUsername(input: MultiStepInput) {
        this.pickState.username = await input.showInputBox({
            title: this.title,
            step: 3,
            totalSteps: 5,
            value: "",
            password: false,
            prompt: "Provide a username",
            validate: validate.isNotEmptyAsync("Username")
        })

        return (input: MultiStepInput) => this.inputPassword(input)
    }

    private async inputPassword(input: MultiStepInput) {
        this.pickState.password = await input.showInputBox({
            title: this.title,
            step: 4,
            totalSteps: 5,
            value: "",
            password: true,
            prompt: "Provide a password",
            validate: validate.isNotEmptyAsync("Password")
        })

        return (input: MultiStepInput) => this.inputOrgId(input)
    }

    private async inputOrgId(input: MultiStepInput) {
        this.pickState.orgId = await input.showInputBox({
            title: this.title,
            step: 5,
            totalSteps: 5,
            value: "",
            password: false,
            prompt: "Provide a vRA organization ID",
            validate: async () => ""
        })

        // end of steps
    }
}
