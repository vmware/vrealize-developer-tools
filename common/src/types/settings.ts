/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export type TraceLevel = "off" | "messages" | "verbose"
export type LogLevel = "off" | "info" | "debug"

export interface CommandPaletteInfo {
    useFullyQualifiedNames: boolean
}

export interface MavenInfo {
    profile?: string
}

export interface TasksInfo {
    disable: boolean
    exclude: string[]
}

export interface ExperimentalFlags {
    typescript: boolean
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
    experimental: ExperimentalFlags
    buildTools: BuildTools,
    views: Views
}
