/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire, Logger, Token, TokenPair, VraIdentityIO } from "vrealize-common"
import * as vscode from "vscode"

import { Registrable } from "../Registrable"
import { ScopedMemento } from "../storage/ScopedMemento"
import { Commands } from "../constants"

@AutoWire
export class VraIdentityStore implements VraIdentityIO, Registrable {
    private readonly logger = Logger.get("VraIdentityStore")
    private storedTokens: ScopedMemento

    constructor() {
        // empty
    }

    register(context: vscode.ExtensionContext): void {
        this.logger.debug("Registering the vRA identity mediator")
        this.storedTokens = ScopedMemento.fromContext(context, "global", "vra-tokens")
    }

    async clear(host: string): Promise<void> {
        await this.storedTokens.removeSecure(`access:${host}`)
        await this.storedTokens.removeSecure(`refresh:${host}`)
    }

    async write(host: string, token: Token): Promise<void> {
        await this.storedTokens.setSecure(`access:${host}`, token.access_token, token.expires_in)
        await this.storedTokens.setSecure(`refresh:${host}`, token.refresh_token)
    }

    async read(host: string): Promise<TokenPair | undefined> {
        const access = await this.storedTokens.getSecure(`access:${host}`)
        const refresh = await this.storedTokens.getSecure(`refresh:${host}`)

        if ((access && refresh) || (!access && refresh)) {
            return {
                accessToken: access ?? undefined,
                refreshToken: refresh
            }
        }

        vscode.window.showErrorMessage("Missing vRA authentication", "Authenticate").then(selected => {
            if (selected === "Authenticate") {
                vscode.commands.executeCommand(Commands.ConfigureVraAuth)
            }
        })
        return undefined
    }
}
