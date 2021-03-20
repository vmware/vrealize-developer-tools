/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { ExtensionContext, Memento } from "vscode"
import { sleep } from "vrealize-common"

import { ScopedMemento } from "../client/storage/ScopedMemento"

import "jest-extended"

describe("ScopedMemento", () => {
    let storage = {}

    const MementoMock = jest.fn<Memento, any[]>(() => ({
        get: jest.fn((key: string, defaultValue?: any) => {
            if (storage[key]) {
                return storage[key]
            }

            return defaultValue
        }),
        update: jest.fn((key: string, value: any) => {
            storage[key] = value
            return Promise.resolve()
        })
    }))

    let memento: Memento

    beforeEach(() => {
        storage = {}
        memento = new MementoMock()
    })

    it("isolates state into namespaces", () => {
        const globalState1 = ScopedMemento.from(memento, "namespace1")
        const globalState2 = ScopedMemento.from(memento, "namespace2")
        globalState1.set("key", 1)
        globalState2.set("key", 2)

        expect(storage["namespace1"]).toBeDefined()
        expect(storage["namespace2"]).toBeDefined()

        expect(storage["namespace1"]["key"]["value"]).toBe(1)
        expect(storage["namespace2"]["key"]["value"]).toBe(2)
    })

    it("throws if no memento is provided", () => {
        expect(() => ScopedMemento.from(null as any)).toThrow("Missing memento parameter")
    })

    it("can be instantiated from extension context", () => {
        const ExtensionmementoMock = jest.fn<ExtensionContext, any[]>(
            () =>
                ({
                    workspaceState: new MementoMock(),
                    globalState: new MementoMock()
                } as ExtensionContext)
        )

        const context: ExtensionContext = new ExtensionmementoMock()

        ScopedMemento.fromContext(context, "workspace")
        expect(context.workspaceState.get).toHaveBeenCalled()

        ScopedMemento.fromContext(context, "global")
        expect(context.globalState.get).toHaveBeenCalled()
    })

    describe("set", () => {
        it("assigns a non-expiring value to a key", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("simple", 1)
            globalState.set("obj", { key: true })
            globalState.set("null", null)

            expect(memento.update).toHaveBeenCalled()

            expect(storage["cache"]["simple"]["value"]).toBe(1)
            expect(storage["cache"]["simple"]["expiration"]).toBe(-1)

            expect(storage["cache"]["obj"]["value"]).toEqual({ key: true })
            expect(storage["cache"]["obj"]["expiration"]).toBe(-1)

            expect(storage["cache"]["null"]["value"]).toBe(null)
            expect(storage["cache"]["null"]["expiration"]).toBe(-1)
        })

        it("assigns an expiring value to a key", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val", 15)

            expect(memento.update).toHaveBeenCalled()

            expect(storage["cache"]["key"]["value"]).toBe("val")
            expect(storage["cache"]["key"]["expiration"]).not.toBe(-1)
        })

        it("cannot remove the value by assigning 'undefined' to a key", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val")
            globalState.set("key", undefined)

            expect(memento.update).toHaveBeenCalled()
            expect(storage["cache"]["key"]["value"]).toBe("val")
        })
    })

    describe("get", () => {
        it("returns a value by its key", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("simple", 1)
            globalState.set("obj", { key: true })
            globalState.set("null", null)

            expect(globalState.get("simple")).toBe(1)
            expect(globalState.get("obj")).toEqual({ key: true })
            expect(globalState.get("null")).toBe(null)
        })

        it("returns 'undefined' if there is no state", async () => {
            const globalState = ScopedMemento.from(memento)

            expect(globalState.get("key")).toBeUndefined()
        })

        it("returns a default value if the provided key is undefined", () => {
            const globalState = ScopedMemento.from(memento)

            expect(globalState.get("key", 100)).toBe(100)
        })

        it("returns 'undefined' if the provided key has expired", async () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val", 2)

            expect(globalState.get("key")).toBe("val")
            await sleep(100)
            expect(globalState.get("key")).toBe("val")
            await sleep(2000)
            expect(globalState.get("key")).toBeUndefined()
        })
    })

    describe("has", () => {
        it("returns 'false' if a key is not defined", () => {
            const globalState = ScopedMemento.from(memento)

            expect(globalState.has("key")).toBe(false)
        })

        it("returns 'true' if a key is defined", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", 2)
            expect(globalState.has("key")).toBe(true)
        })

        it("returns 'false' if a key has expired", async () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val", 1)

            await sleep(1500)
            expect(globalState.has("key")).toBe(false)
        })

        it("returns 'true' if a key has not expired", async () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val", 5)

            await sleep(1500)
            expect(globalState.has("key")).toBe(true)
        })
    })

    describe("remove", () => {
        it("deletes a key's value", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val")

            expect(globalState.get("key")).toBe("val")
            globalState.remove("key")
            expect(globalState.get("key")).toBeUndefined()
        })

        it("does nothing if a key doesn't exist", () => {
            const globalState = ScopedMemento.from(memento)
            expect(() => globalState.remove("some-nonexisting-key")).not.toThrow()
        })
    })

    describe("keys", () => {
        it("returns all defined keys", () => {
            const globalState = ScopedMemento.from(memento)

            globalState.set("number", 1)
            globalState.set("string", "value")
            globalState.set("boolean", true)
            globalState.set("object", { key: true })
            globalState.set("null", null)

            const keys = globalState.keys()
            expect(keys).toBeDefined()
            expect(keys).toIncludeAllMembers(["number", "string", "boolean", "object", "null"])
        })
    })

    describe("all", () => {
        it("returns all entries", () => {
            const globalState = ScopedMemento.from(memento)
            const entries = {
                number: 1,
                string: "value",
                booleam: true,
                object: { key: true },
                null: null
            }

            for (const k of Object.keys(entries)) {
                globalState.set(k, entries[k])
            }

            const all = globalState.all()
            expect(all).toBeDefined()
            expect(all).toEqual(entries)
        })
    })

    describe("clear", () => {
        it("deletes all entries", () => {
            const globalState = ScopedMemento.from(memento)
            const entries = {
                number: 1,
                string: "value",
                booleam: true,
                object: { key: true },
                null: null
            }

            for (const k of Object.keys(entries)) {
                globalState.set(k, entries[k])
            }

            globalState.clear()
            expect(memento.update).toHaveBeenCalled()
            expect(globalState.all()).toEqual({})
        })
    })

    describe("getExpiration", () => {
        it("returns the expiration timestamp (in sec) of a key", () => {
            const globalState = ScopedMemento.from(memento)
            const originalDateNow = Date.now
            Date.now = jest.fn().mockReturnValue(1_000) // 1 sec
            globalState.set("key", "val", 15)

            expect(globalState.getExpiration("key")).toEqual(16)
            Date.now = originalDateNow
        })

        it("returns 'undefined' if a key is not defined", () => {
            const globalState = ScopedMemento.from(memento)
            expect(globalState.getExpiration("some-key")).toBeUndefined()
        })

        it("returns 'undefined' if a key does not expire", () => {
            const globalState = ScopedMemento.from(memento)
            globalState.set("key", "val")
            expect(globalState.getExpiration("key")).toBeUndefined()
        })
    })
})
