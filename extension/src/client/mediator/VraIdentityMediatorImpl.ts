/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AuthGrant, AutoWire, Logger, Token, VraIdentityMediator } from "vrealize-common"
import * as vscode from "vscode"

import { Registrable } from "../Registrable"
import { ScopedMemento } from "../system/ScopedMemento"
import { Commands } from "../constants"

@AutoWire
export class VraIdentityMediatorImpl implements VraIdentityMediator, Registrable {
    private readonly logger = Logger.get("VraIdentityMediatorImpl")
    private storedTokens: ScopedMemento

    constructor() {
        // empty
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the vRA identity mediator")
        this.storedTokens = ScopedMemento.fromContext(context, "global", "vra-tokens")
    }

    async write(host: string, token: Token): Promise<void> {
        await this.storedTokens.set(`access:${host}`, token.access_token, token.expires_in)
        await this.storedTokens.set(`refresh:${host}`, token.refresh_token)
    }

    async read(host: string): Promise<AuthGrant | undefined> {
        const access = this.storedTokens.get<string>(`access:${host}`)
        const refresh = this.storedTokens.get<string>(`refresh:${host}`)

        if ((access && refresh) || (!access && refresh)) {
            return {
                type: "refresh_token",
                accessToken: access,
                refreshToken: refresh
            }
        }

        return vscode.commands.executeCommand(Commands.ConfigureVraAuth)
    }
}
