/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as server from "vscode-languageserver"

import { ConnectionLocator, Initializer } from "../server/core"

type EventHandler = server.RequestHandler<server.InitializeParams, server.InitializeResult, server.InitializeError>

describe("Core", () => {
    describe("Initializer", () => {
        it("should notify all listeners once the initialize event is triggered", () => {
            let callback: EventHandler | undefined
            const createConnectionStub = jest.spyOn(server, "createConnection").mockReturnValue({
                onInitialize: (cb: EventHandler) => {
                    callback = cb
                },
                onInitialized: () => {
                    // empty
                }
            } as any)

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
                callback(
                    {
                        processId: 0,
                        rootUri: null,
                        workspaceFolders: null,
                        capabilities: {}
                    },
                    server.CancellationToken.None
                ) // simulate the onInitialize event
            }

            expect(listener1).toHaveBeenCalled()
            expect(listener2).toHaveBeenCalled()
            expect(listener3).toHaveBeenCalled()

            createConnectionStub.mockRestore()
        })
    })
})
