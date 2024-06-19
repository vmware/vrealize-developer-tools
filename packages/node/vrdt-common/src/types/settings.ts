/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export type TraceLevel = "off" | "messages" | "verbose"
export type LogLevel = "off" | "info" | "debug"
export type VraAuthType = "refresh_token" | "password"

export interface CommandPaletteInfo {
    useFullyQualifiedNames: boolean
    multiStep: {
        pinned: boolean
    }
}

export interface MavenInfo {
    profile?: string
}

export interface VraInfo {
    auth: AuthInfo
}

export interface AuthInfo {
    type?: VraAuthType
    host?: string
    port: number
}

export interface TasksInfo {
    disable: boolean
    exclude: string[]
}

export interface VroInfo {
    inventory: InventoryInfo
}

export interface InventoryInfo {
    cache: boolean
}

export interface BuildTools {
    defaultVersion: string
}

export interface Views {
    explorer: ExplorerView
}

export interface ExplorerView {
    actions: ActionsView
}

export interface ActionsView {
    layout: "tree" | "compact" | "flat"
}

export interface VrealizeSettings {
    log: LogLevel
    trace: TraceLevel
    commandPalette: CommandPaletteInfo
    tasks: TasksInfo
    maven: MavenInfo
    buildTools: BuildTools
    views: Views
    vra: VraInfo
    vro: VroInfo
}
