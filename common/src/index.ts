/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as di from "./di"
import * as proc from "./proc"
import * as promise from "./promise"
import * as uri from "./uri"

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export { default as Logger, LogChannel } from "./logger"
export { AutoWire } from "./di"
export * from "./event"
export * from "./maven"
export * from "./ts"
export * from "./platform"
export * from "./types"
export * from "./rest"
export * from "./hierarchy"

export { di, proc, promise, uri }
