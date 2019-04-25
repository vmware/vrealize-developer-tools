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
    ToggleTypeScript = "vrdev.toggle.typescript",
    RefreshExplorer = "vrdev.views.explorer.refresh"
}

export enum FixCommands {
    PomFixLine = "vrdev.pom.diagnostics.fixLine"
}

export enum Diagnostics {
    LintingResults = "vRealize diagnostics"
}
export enum Views {
    Explorer = "vrdev.views.explorer"
}

export class Patterns {
    static readonly PomParent = /<parent>[\s\S]*<\/parent>/i
    static readonly PomArtifactId = /^[A-Za-z0-9_\-]+$/
    static readonly PomGroupId = /^[A-Za-z0-9_\-.]+$/

    // https://regex101.com/r/gxlA8L/1
    static readonly PackageSplit = /^(.+?)(?:-(\d+\.\d+.\d+(?:-SNAPSHOT)?))?$/
}

export enum OutputChannels {
    ExtensionLogs = "vRealize Developer Tools",
    LanguageServerLogs = "vRO - Language Server",
    RunActionLogs = "vRO - Execution Log"
}

export enum ProjectArchetypes {
    TypeScript = "com.vmware.pscoe.o11n:typescript-project",
    Base = "com.vmware.pscoe.o11n:base-package",
    Actions = "com.vmware.pscoe.o11n:actions-package",
    Xml = "com.vmware.pscoe.o11n:xml-package",
    Vra = "com.vmware.pscoe.vra:vra-package"
}
