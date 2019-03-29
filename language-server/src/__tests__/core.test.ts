/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as server from "vscode-languageserver"
import { CancellationToken } from "vscode-languageserver"

import { ConnectionLocator, Initializer } from "../server/core"

import { jestSpy } from "./jestSpy"

type EventHandler = server.RequestHandler<
    server.InitializeParams, server.InitializeResult, server.InitializeError>

describe("Core", () => {
    describe("Initializer", () => {
        it("should notify all listeners once the initialize event is triggered", () => {
            let callback: EventHandler | undefined
            const createConnectionStub = jestSpy(server, "createConnection")
                .mockReturnValue({
                    onInitialize: (cb: EventHandler) => {
                        callback = cb
                    },
                    onInitialized: () => {
                        // empty
                    }
                })

            const initializer = new Initializer(new ConnectionLocator())

            expect(callback).not.toBeUndefined()
            expect(callback).not.toBeNull()

            const listener1 = jest.fn()
            const listener2 = jest.fn()
            const listener3 = jest.fn()

            initializer.onInitialize(listener1)
            initializer.onInitialize(listener2)
            initializer.onInitialize(listener3)

            if (callback) {
                callback({
                    processId: 0,
                    rootUri: null,
                    workspaceFolders: null,
                    capabilities: {}
                }, CancellationToken.None) // simulate the onInitialize event
            }

            expect(listener1).toHaveBeenCalled()
            expect(listener2).toHaveBeenCalled()
            expect(listener3).toHaveBeenCalled()

            createConnectionStub["restore"]()
        })
    })
})
