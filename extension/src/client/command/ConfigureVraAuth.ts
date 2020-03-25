/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AuthGrant, AutoWire, Logger, VraAuthType } from "vrealize-common"
import * as vscode from "vscode"

import { Commands } from "../constants"
import { ConfigurationManager } from "../system"
import { MultiStepInput, QuickPickParameters } from "../ui/MultiStepInput"
import { Command } from "./Command"

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
        label: "Refresh Token",
        description: "A vRO project that contains only actions as JavaScript files."
    },
    {
        id: "password",
        label: "Username and password",
        description: "A legacy vRO project that can contain any vRO content."
    }
]

@AutoWire
export class ConfigureVraAuth extends Command<AuthGrant> {
    private readonly logger = Logger.get("ConfigureVraAuth")
    private title: string
    private pickState = {} as AuthPickState

    constructor(private config: ConfigurationManager) {
        super()
    }

    get commandId(): string {
        return Commands.ConfigureVraAuth
    }

    async execute(context: vscode.ExtensionContext, host: string): Promise<AuthGrant> {
        this.logger.info("Executing command Configure vRA Authentication")
        this.pickState = {} as AuthPickState
        this.title = `Configure vRA authentication: ${host}`
        await MultiStepInput.run(input => this.pickHost(input))

        return {
            type: this.pickState.grantType,
            refreshToken: this.pickState.refreshToken,
            username: this.pickState.username,
            password: this.pickState.password,
            orgId: this.pickState.orgId
        }
    }

    private async pickHost(input: MultiStepInput) {
        const host = this.config.vrdev.vra.auth.host

        if (!host) {
            const hostAndPort = await input.showInputBox({
                title: this.title,
                step: 1,
                totalSteps: 2,
                value: "console.cloud.vmware.com",
                password: false,
                prompt: "Provide a vRA host and optional port",
                validate: this.isNotEmpty("Host")
            })

            const [host, port] = hostAndPort.split(":")

            await vscode.workspace
                .getConfiguration("vrdev.vra.auth")
                .update("host", host, vscode.ConfigurationTarget.Workspace)

            await vscode.workspace
                .getConfiguration("vrdev.vra.auth")
                .update("port", port, vscode.ConfigurationTarget.Workspace)
        }

        return (input: MultiStepInput) => this.pickAuthType(input)
    }

    private async pickAuthType(input: MultiStepInput) {
        const authType = this.config.vrdev.vra.auth.type

        if (!authType) {
            const pick = await input.showQuickPick<AuthTypeItem, QuickPickParameters<AuthTypeItem>>({
                title: this.title,
                step: 2,
                totalSteps: 3,
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
            validate: this.isNotEmpty("Refresh Token")
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
            validate: this.isNotEmpty("Username")
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
            validate: this.isNotEmpty("Password")
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

    private isNotEmpty(name: string) {
        return async (value: string) => (!value ? `${name} is required` : "")
    }
}
