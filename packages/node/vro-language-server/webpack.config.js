/* Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT */

//@ts-check

"use strict"

const withDefaults = require("../../../webpack.config")
const path = require("path")

module.exports = withDefaults({
    context: path.join(__dirname),
    entry: {
        extension: "./src/server/langserver.ts"
    },
    output: {
        filename: "langserver.js",
        path: path.join(__dirname, "dist")
    }
})
