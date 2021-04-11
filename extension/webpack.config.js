/* Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT */

//@ts-check

"use strict"

const withDefaults = require("../webpack.config")
const path = require("path")

module.exports = withDefaults({
    context: path.join(__dirname),
    entry: {
        extension: "./src/extension.ts"
    },
    output: {
        filename: "extension.js",
        path: path.join(__dirname, "dist")
    }
})
