/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export type AuthMethod = "basic" | "vra" | "vc" | "vrang"

export interface Auth {
    readonly method: AuthMethod
    toRequestJson(): Record<string, unknown>
}

export class Credentials {
    readonly username: string
    readonly password: string
}

export class BasicAuth implements Auth {
    readonly method: AuthMethod = "basic"
    readonly credentials: Credentials

    constructor(username?: string, password?: string) {
        if (!username) {
            throw new Error("Missing username parameter for basic auth")
        }

        if (!password) {
            throw new Error("Missing pasword parameter for basic auth")
        }

        this.credentials = { username, password }
    }

    toRequestJson(): Record<string, unknown> {
        return {
            user: this.credentials.username,
            pass: this.credentials.password
        }
    }
}

export class VraSsoAuth implements Auth {
    readonly method: AuthMethod = "vra"
    readonly token: string

    constructor(token: string) {
        this.token = token
    }

    toRequestJson(): Record<string, unknown> {
        return {
            bearer: this.token
        }
    }
}

export class VraNgAuth implements Auth {
    readonly method: AuthMethod = "vrang"
    readonly token: string

    constructor(token: string) {
        this.token = token
    }

    toRequestJson(): Record<string, unknown> {
        return {
            bearer: this.token
        }
    }
}
