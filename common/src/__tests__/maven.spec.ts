/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import "jest-extended"
import * as path from "path"

import { PomFile } from "../maven"

describe("Maven", () => {
    const NOT_POM_PATH = path.join(__dirname, "__fixtures__/not.pom.xml")
    const PARTIAL_POM_PATH = path.join(__dirname, "__fixtures__/partial.pom.xml")
    const UNKNOWN_POM_PATH = path.join(__dirname, "__fixtures__/unknown.pom.xml")
    const BASE_POM_PATH = path.join(__dirname, "__fixtures__/base.pom.xml")
    const ACTIONS_POM_PATH = path.join(__dirname, "__fixtures__/actions.pom.xml")

    describe("PomFile", () => {
        it("Should throw if file is missing parent tag", () => {
            expect(() => new PomFile(NOT_POM_PATH)).toThrow("Missing parent tag")
        })

        it("Should throw if file has parent with missing artifactId/groupId tag", () => {
            expect(() => new PomFile(PARTIAL_POM_PATH)).toThrow("Missing parent groupId or artifactId")
        })

        it("Should throw if file is not a valid vRealize project", () => {
            expect(() => new PomFile(UNKNOWN_POM_PATH)).toThrow("Not a valid vRealize project parent ID")
        })

        it("Can differentiate base package from child one", () => {
            const basePom = new PomFile(BASE_POM_PATH)
            expect(basePom.isBase).toBe(true)

            const actionsPom = new PomFile(ACTIONS_POM_PATH)
            expect(actionsPom.isBase).toBe(false)
        })

        it("Can read pom.xml properties", () => {
            const actionsPom = new PomFile(ACTIONS_POM_PATH)
            expect(actionsPom.groupId).toBe("com.vmware.pscoe.prj")
            expect(actionsPom.artifactId).toBe("test-pom")
            expect(actionsPom.version).toBe("2.0.0")
            expect(actionsPom.parentId).toBe("com.vmware.pscoe.o11n:actions-package")
            expect(actionsPom.parentVersion).toBe("1.0.0")
        })

        it("Can read pom.xml modules", () => {
            const actionsPom = new PomFile(ACTIONS_POM_PATH)
            expect(actionsPom.isBase).toBe(false)
            expect(actionsPom.modules).toBeEmpty()

            const basePom = new PomFile(BASE_POM_PATH)
            expect(basePom.isBase).toBe(true)
            expect(basePom.modules).toEqual(["actions", "workflows", "vra"])
        })
    })
})
