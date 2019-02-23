/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

 import { expect } from "chai"
 import "mocha"

 import { Container } from "../di/Container"

 import * as Mocks from "./Mocks"

 describe("Container tests", () => {

    it("Can load class without constructor", () => {
        const container = new Container()
        const obj = container.get(Mocks.NoConstructor)
        expect(obj).to.be.instanceof(Mocks.NoConstructor)
    })

    it("Can load class with more params", () => {
        const container = new Container()
        const obj = container.get(Mocks.WithOneParam)
        expect(obj).to.be.instanceof(Mocks.WithOneParam)
        expect(obj.p).to.be.instanceof(Mocks.NoConstructor)
        expect(obj.p).to.equal(obj.second)
    })

    it("Should throw circular dep exception", () => {
        const container = new Container()
        expect(() => {
            container.get(Mocks.C1)
        }).to.throw()
    })

    it("Should throw on not annotated class", () => {
        const container = new Container()
        expect(() => {
            container.get(Mocks.NotAutoWired)
        }).to.throw()
    })

    it("Should not throw if the instance was aready set", () => {
        const container = new Container()
        container.set(Mocks.NotAutoWired, new Mocks.NotAutoWired())
        expect(() => {
            container.get(Mocks.NotAutoWired)
        }).not.to.throw()
    })

    it("Should throw if constructor has interface type", () => {
        const container = new Container()
        expect(() => {
            container.get(Mocks.IntInConst)
        }).to.throw()
    })
})
