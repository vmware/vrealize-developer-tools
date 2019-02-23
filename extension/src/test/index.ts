/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as testRunner from "vscode/lib/testrunner"

testRunner.configure({
    ui: "bdd",
    useColors: true
})

module.exports = testRunner
