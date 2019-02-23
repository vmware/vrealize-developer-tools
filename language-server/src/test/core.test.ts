/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as chai from "chai"
import "mocha"
import * as sinon from "sinon"
import * as sinonChai from "sinon-chai"
import * as server from "vscode-languageserver"
import { CancellationToken } from "vscode-languageserver"

import { ConnectionLocator, Initializer } from "../server/core"

const expect = chai.expect
chai.use(sinonChai)

type EventHandler = server.RequestHandler<
    server.InitializeParams, server.InitializeResult, server.InitializeError>

describe("Core", () => {
    describe("Initializer", () => {
        it("should notify all listeners once the initialize event is triggered", () => {
            let callback: EventHandler | undefined
            const createConnectionStub = sinon.stub(server, "createConnection")
            createConnectionStub.returns({
                onInitialize: (cb: EventHandler) => {
                    callback = cb
                },
                onInitialized: () => {
                    // empty
                }
            })

            const initializer = new Initializer(new ConnectionLocator())

            expect(callback).to.not.equal(undefined)
            expect(callback).to.not.equal(null)

            const listener1 = sinon.spy()
            const listener2 = sinon.spy()
            const listener3 = sinon.spy()

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

            expect(listener1).to.have.been.called
            expect(listener2).to.have.been.called
            expect(listener3).to.have.been.called

            createConnectionStub.restore()
        })
    })
})
