/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { makeHierarchical } from "../hierarchy"

describe("hierarchy", () => {
    const categories = ["com.vmware.pscoe.prj", "com.vmware.pscoe.prj.feature", "com.vmware.pscoe.prj.feature2"]

    it("converts flat path to hierarchical form", () => {
        const hierarchy = makeHierarchical(
            categories,
            category => category.split("."),
            (...paths: string[]) => paths.join("."),
            () => true,
            false
        )

        expect(hierarchy.parent).toBeUndefined()
        expect(hierarchy.children).toBeDefined()
        expect(hierarchy.children?.size).toEqual(1)
        expect(hierarchy.children?.get("com")?.name).toEqual("com")
    })

    it("converts flat path to compact hierarchical form", () => {
        const hierarchy = makeHierarchical(
            categories,
            category => category.split("."),
            (...paths: string[]) => paths.join("."),
            () => true,
            true
        )

        expect(hierarchy.parent).toBeUndefined()
        expect(hierarchy.children).toBeDefined()
        expect(hierarchy.children?.size).toEqual(1)
        expect(hierarchy.children?.values().next().value.name).toEqual("com.vmware.pscoe.prj")
    })
})
