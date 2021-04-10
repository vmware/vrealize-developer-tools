/*
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

module.exports = {
    preset: "ts-jest",
    testMatch: ["**/__tests__/**/*.spec.ts"],
    collectCoverage: true,
    setupFilesAfterEnv: ["jest-extended"],
    coveragePathIgnorePatterns: [".*/__tests__/.*", ".*/src/proto/.*", ".*/vrdt-common/src/rest/.*"],
    globals: {
        "ts-jest": {
            "tsconfig": "<rootDir>/tsconfig.json",
            "diagnostics": {
                "warnOnly": true
            }
        }
    }
};
