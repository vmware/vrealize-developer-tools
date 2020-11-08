/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { ExtensionContext, Memento } from "vscode"

import { systemKeychain } from "../system/Keychain"

export class ScopedMemento {
    private memento: Memento
    private namespace: string
    private state: Record<string, any>

    private constructor(memento: Memento, namespace: string) {
        if (!memento) {
            throw new Error("Missing memento parameter")
        }

        this.memento = memento
        this.namespace = namespace
        this.state = this.memento.get(this.namespace, {})
    }

    static from(memento: Memento, namespace?: string): ScopedMemento {
        return new ScopedMemento(memento, namespace || "cache")
    }

    static fromContext(context: ExtensionContext, scope: "workspace" | "global", namespace?: string): ScopedMemento {
        const memento = scope === "workspace" ? context.workspaceState : context.globalState
        return ScopedMemento.from(memento, namespace)
    }

    async set(key: string, value?: any, expiration?: number): Promise<void> {
        if (typeof key !== "string" || typeof value === "undefined") {
            return Promise.resolve(void 0)
        }

        const obj = {
            value: value,
            expiration: -1
        }

        if (expiration && Number.isInteger(expiration)) {
            obj.expiration = this.now() + expiration
        }

        this.state[key] = obj
        return this.memento.update(this.namespace, this.state)
    }

    async setSecure(key: string, value?: any, expiration?: number): Promise<void> {
        if (typeof key !== "string" || typeof value === "undefined") {
            return Promise.resolve(void 0)
        }

        await this.set(key, "- encrypted -", expiration)
        return systemKeychain.setPassword(`vrdt:${this.namespace}`, key, value)
    }

    get<T>(key: string, defaultValue?: T): T | undefined {
        if (this.state[key] === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue
            }

            return undefined
        }

        if (this.isExpired(key)) {
            return undefined
        }

        return this.state[key].value
    }

    async getSecure(key: string): Promise<string | null | undefined> {
        if (this.isExpired(key)) {
            return undefined
        }

        return systemKeychain.getPassword(`vrdt:${this.namespace}`, key)
    }

    has(key: string): boolean {
        if (this.state[key] === undefined) {
            return false
        }

        return !this.isExpired(key)
    }

    async remove(key: string): Promise<void> {
        if (this.state[key] === undefined) {
            return Promise.resolve(void 0)
        }

        delete this.state[key]
        return this.memento.update(this.namespace, this.state)
    }

    async removeSecure(key: string): Promise<boolean> {
        await this.remove(key)
        return systemKeychain.deletePassword(`vrdt:${this.namespace}`, key)
    }

    keys(): string[] {
        return Object.keys(this.state)
    }

    all() {
        const items = {}
        for (const key in this.state) {
            items[key] = this.state[key].value
        }

        return items
    }

    async clear(): Promise<void> {
        this.state = {}
        return this.memento.update(this.namespace, undefined)
    }

    getExpiration(key: string): number | undefined {
        if (this.state[key] === undefined || this.state[key].expiration === -1) {
            return undefined
        }

        return this.state[key].expiration
    }

    isExpired(key: string): boolean {
        if (this.state[key] === undefined || this.state[key].expiration === -1) {
            return false
        }

        return this.now() >= this.state[key].expiration
    }

    private now(): number {
        return Math.floor(Date.now() / 1000)
    }
}
