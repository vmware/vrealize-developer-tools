/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
jest.mock("@vmware/vrdt-common", () => ({
    AutoWire: jest.fn(),
    Logger: {
        get: jest.fn(() => ({
            info: jest.fn()
        }))
    }
}))

jest.mock("../server/core/Capabilities", () => ({
    __esModule: true,
    default: {}
}))

jest.mock("../server/core/ConnectionLocator", () => ({
    ConnectionLocator: jest.fn(() => ({
        connection: {
            onInitialize: jest.fn(),
            onInitialized: jest.fn()
        }
    }))
}))

import { Initializer } from "../server/core/Initializer"

describe("Initializer", () => {
    let connectionLocator: any
    let initializer: Initializer

    beforeEach(() => {
        connectionLocator = {
            connection: {
                onInitialize: jest.fn(),
                onInitialized: jest.fn()
            }
        }
        initializer = new Initializer(connectionLocator)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it("should call registered listeners on initialized event", () => {
        const event = {}
        const initdListener = jest.fn()
        initializer.onInitialized(initdListener)
        initializer["initialized"](event)

        expect(initdListener).toHaveBeenCalledWith(event)
    })
})
