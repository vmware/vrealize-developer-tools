/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export const extensionShortName = "vRealize"

export enum BuiltInCommands {
    Open = "vscode.open",
    OpenFolder = "vscode.openFolder",
    SetContext = "setContext"
}

export enum Commands {
    TriggerServerCollection = "vrdev.triggerServerCollection",
    ChangeProfile = "vrdev.change.profile",
    NewProject = "vrdev.new.project",
    OpenAction = "vrdev.open.action",
    OpenConfiguration = "vrdev.open.configElement",
    RunAction = "vrdev.run.action",
    ToggleTypeScript = "vrdev.toggle.typescript"
}

export enum FixCommands {
    PomFixLine = "vrdev.pom.diagnostics.fixLine"
}

export enum Diagnostics {
    LintingResults = "vRealize diagnostics"
}

export enum OutputChannels {
    ExtensionLogs = "vRealize Developer Tools",
    LanguageServerLogs = "vRO - Language Server",
    RunActionLogs = "vRO - Execution Log"
}
export class MavenPom {
    static readonly ParentPattern = /<parent>[\s\S]*<\/parent>/i
    static readonly ArtifactIdPattern = /^[A-Za-z0-9_\-]+$/
    static readonly GroupIdPattern = /^[A-Za-z0-9_\-.]+$/
}
