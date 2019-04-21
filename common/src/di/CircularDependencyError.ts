/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export class CircularDependencyError extends Error {
    constructor(currentClass: string, public visited: string[]) {
        super(`Circular dependency detected; current class name: ${currentClass}`)
    }
}
