/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import createMockInstance from "jest-create-mock-instance"

import { AbstractWatcher } from "../event"
import { default as Logger } from "../logger"

class SomeWatcher extends AbstractWatcher<string> {
    protected readonly logger = createMockInstance(Logger)

    constructor() {
        super()
    }

    fireEvent(): void {
        this.notifyListeners("someEvent")
    }

    addListener(listener: (event: string) => void): { dispose(): any } {
        return this.registerListener(listener)
    }
}

describe("AbstractWatcher", () => {
    let watcher: SomeWatcher

    beforeEach(() => {
        watcher = new SomeWatcher()
    })

    it("Can accept listeners", () => {
        const listener = jest.fn()
        watcher.addListener(listener)
        expect(watcher["listeners"]).toContain(listener)
    })

    it("Should notify all registered listeners once", () => {
        const listener1 = jest.fn()
        const listener2 = jest.fn()

        watcher.addListener(listener1)
        watcher.addListener(listener2)

        watcher.fireEvent()

        expect(listener1).toHaveBeenCalledTimes(1)
        expect(listener2).toHaveBeenCalledTimes(1)
    })

    it("Should not notify disposed listeners", () => {
        const listener1 = jest.fn()
        const listener2 = jest.fn()

        watcher.addListener(listener1)
        watcher.addListener(listener2).dispose()

        watcher.fireEvent()

        expect(listener1).toHaveBeenCalledTimes(1)
        expect(listener2).not.toHaveBeenCalled()
    })
})
