/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { ClassFilter, HintLookup } from "../server/core/HintLookup"
import { Environment } from "../server/core/Environment"
import { ConfigurationWatcher } from "../server/core/ConfigurationWatcher"
import { WorkspaceFoldersWatcher } from "../server/core/WorkspaceFoldersWatcher"
import { Initializer } from "../server/core/Initializer"

describe("HintLookup", () => {
    let hintLookup: HintLookup
    let environment: Environment
    let configWatcher: ConfigurationWatcher
    let workspaceWatcher: WorkspaceFoldersWatcher
    let initializer: Initializer

    beforeEach(() => {
        environment = {
            workspaceFolders: [],
            resolveHintFile: jest.fn()
        } as any
        configWatcher = { onDidChangeConfiguration: jest.fn() } as any
        workspaceWatcher = { onDidChangeWorkspaceFolders: jest.fn() } as any
        initializer = { onInitialize: jest.fn() } as any
        hintLookup = new HintLookup(environment, configWatcher, workspaceWatcher, initializer)
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    describe("getActionModules", () => {
        it("returns global action modules if no workspace folder is provided", () => {
            hintLookup.actions.global = [
                {
                    modules: [{ name: "globalModule1" }, { name: "globalModule2" }],
                    uuid: "",
                    version: 1,
                    toJSON: jest.fn()
                }
            ]

            const modules = hintLookup.getActionModules()

            expect(modules).toEqual([{ name: "globalModule1" }, { name: "globalModule2" }])
        })

        it("deduplicates modules with the same name", () => {
            hintLookup.actions.global = [
                {
                    modules: [{ name: "module1" }, { name: "module2" }],
                    uuid: "",
                    version: 1,
                    toJSON: jest.fn()
                },
                {
                    modules: [{ name: "module1" }, { name: "module3" }],
                    uuid: "",
                    version: 1,
                    toJSON: jest.fn()
                }
            ]

            const modules = hintLookup.getActionModules()

            expect(modules).toEqual([{ name: "module1" }, { name: "module2" }, { name: "module3" }])
        })
    })

    describe("getGlobalActionsPack", () => {
        it("returns a pack with a UUID and version number", () => {
            const pack = hintLookup.getGlobalActionsPack()
            expect(pack.uuid).toBeTruthy()
            expect(pack.version).toBe(1)
        })

        it("returns a pack with an empty toJSON method", () => {
            const pack = hintLookup.getGlobalActionsPack()
            expect(pack.toJSON()).toEqual({})
        })
    })

    describe("collectVroObjects", () => {
        it("stores the provided VRO objects", () => {
            const vroObjects = [{ name: "test", properties: [] }]
            hintLookup.collectVroObjects(vroObjects)
            expect(hintLookup.getClasses(new ClassFilter())).toEqual(vroObjects)
        })
    })
})
