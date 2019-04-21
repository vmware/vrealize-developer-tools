/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Container } from "../di/Container"
import * as Mocks from "./container.mocks"

describe("Container", () => {
    it("Can load class without constructor", () => {
        const container = new Container()
        const obj = container.get(Mocks.NoConstructor)
        expect(obj).toBeInstanceOf(Mocks.NoConstructor)
    })

    it("Can load class with more params", () => {
        const container = new Container()
        const obj = container.get(Mocks.WithOneParam)
        expect(obj).toBeInstanceOf(Mocks.WithOneParam)
        expect(obj.p).toBeInstanceOf(Mocks.NoConstructor)
        expect(obj.p).toEqual(obj.second)
    })

    it("Should throw circular dep exception", () => {
        const container = new Container()
        expect(() => {
            container.get(Mocks.C1)
        }).toThrow("Circular dependency detected")
    })

    it("Should throw on not annotated class", () => {
        const container = new Container()
        expect(() => {
            container.get(Mocks.NotAutoWired)
        }).toThrow("Class doesn't have property __autowire.")
    })

    it("Should not throw if the instance was aready set", () => {
        const container = new Container()
        container.set(Mocks.NotAutoWired, new Mocks.NotAutoWired())
        expect(() => {
            container.get(Mocks.NotAutoWired)
        }).not.toThrow()
    })

    it("Should throw if constructor has interface type", () => {
        const container = new Container()
        expect(() => {
            container.get(Mocks.IntInConst)
        }).toThrow("Class doesn't have property __autowire.")
    })
})
