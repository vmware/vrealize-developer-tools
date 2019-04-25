/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export type ApiCategoryType =
    | "WorkflowCategory"
    | "ScriptModuleCategory"
    | "ResourceElementCategory"
    | "ConfigurationElementCategory"

export type ApiElementType = "Workflow" | "ScriptModule" | "ResourceElement" | "ConfigurationElement"

export interface VroElementPickInfo {
    kind: "workflow" | "action" | "resource" | "configuration" | "category" | "module"
    name: string
    path?: string | null
    label: string
    description: string
    detail?: string
    id?: string | null
}
