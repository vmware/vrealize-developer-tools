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
    id: string
    name: string
    label: string
    description?: string
    detail?: string
}
