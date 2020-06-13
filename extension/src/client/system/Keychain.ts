/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

// keytar depends on a native module shipped in vscode, so this is how we load it
import * as keytarType from "keytar"

function getNodeModule<T>(moduleName: string): T | undefined {
    // eslint-disable-next-line no-eval
    const vscodeRequire = eval("require")
    try {
        return vscodeRequire(moduleName)
    } catch (err) {}
    return undefined
}

export type Keytar = {
    getPassword: typeof keytarType["getPassword"]
    setPassword: typeof keytarType["setPassword"]
    deletePassword: typeof keytarType["deletePassword"]
}

const failingKeytar: Keytar = {
    async getPassword(service, string) {
        throw new Error("System keychain unavailable")
    },
    async setPassword(service, string, password) {
        throw new Error("System keychain unavailable")
    },
    async deletePassword(service, string) {
        throw new Error("System keychain unavailable")
    }
}

export const systemKeychain: Keytar = getNodeModule<Keytar>("keytar") || failingKeytar
