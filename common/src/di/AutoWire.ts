/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

// tslint:disable:ban-types
export function AutoWire(constructor: Function) {
    Object.defineProperty(constructor, "__autowire", {
        enumerable: false,
        configurable: true,
        value: true
    })
}
