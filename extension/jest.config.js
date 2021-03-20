/*
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

const { pathsToModuleNameMapper } = require("ts-jest/utils")
const { compilerOptions } = require("../tsconfig")

module.exports = Object.assign({}, require("../jest.config"), {
    displayName: "extension",
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/../" })
})
