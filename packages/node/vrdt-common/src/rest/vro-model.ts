/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { ApiCategoryType, ApiElementType } from "../types"

export interface WorkflowParam {
    type: string
    name: string
    value: any
}

export interface LogMessage {
    timestamp: string
    severity: string
    description: string
}

export interface Version {
    "version": string
    "build-number": string
    "build-date": string
    "api-version": string
}

export type WorkflowState =
    | "canceled"
    | "completed"
    | "running"
    | "suspended"
    | "waiting"
    | "waiting-signal"
    | "failed"
    | "initializing"

export interface WorkflowLogsResponse {
    logs: {
        entry: {
            "origin": string
            "severity": string
            "time-stamp": string
            "short-description": string
            "long-description": string
            "time-stamp-val": number
        }
    }[]
}

export interface Resource {
    id: string
    name: string
}

// For better readability a separate interface is created
export interface Configuration extends Resource {
    version: string
}

// For better readability a separate interface is created
export interface Workflow extends Resource {
    version: string
}

export interface Action {
    id: string
    fqn: string
    version: string
}

export interface ApiElement extends Resource {
    type: ApiCategoryType | ApiElementType
    rel: string
}

export interface InventoryElement extends Resource {
    type: string
    rel: string
    href: string
}

export interface ContentLinksResponse {
    link: {
        attributes: { name: string; value: string; type: string }[]
        rel: string
        href: string
    }[]
}

export interface ContentChildrenResponse {
    href: string
    relations: ContentLinksResponse
}
