/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export type VroElementKind = "workflow" | "action" | "resource" | "configuration" | "category" | "module"

export interface VroElementPickInfo {
    kind: VroElementKind
    name: string
    path?: string | null
    label: string
    description: string
    detail?: string
    id?: string | null
}
