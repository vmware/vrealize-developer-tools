/*!
 * Copyright 2018-2019 VMware, Inc.
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
        }
    }[]
}

export interface ApiElement {
    name: string
    id: string
    type: ApiCategoryType | ApiElementType
    rel: string
}

export interface InventoryElement {
    name: string
    id: string
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
