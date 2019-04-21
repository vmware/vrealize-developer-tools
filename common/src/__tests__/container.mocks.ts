/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire } from "../di/AutoWire"

@AutoWire
export class NoConstructor {}

@AutoWire
export class WithOneParam {
    constructor(public p: NoConstructor, public second: NoConstructor) {}
}

@AutoWire
export class C2 {
    constructor(public c: C1) {}
}

@AutoWire
export class C1 {
    constructor(public c: C2) {}
}

export class NotAutoWired {}

export interface Int {}

export class IntClass implements Int {}

@AutoWire
export class IntInConst {
    constructor(public i: Int) {}
}
