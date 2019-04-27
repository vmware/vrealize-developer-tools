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
    RefreshExplorer = "vrdev.views.explorer.refresh",
    FetchRemoteElement = "vrdev.fetchRemoteElement"
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

export enum ElementKinds {
    Action = "vrdev:element:kind:action",
    Actions = "vrdev:element:kind:actions",
    Workflow = "vrdev:element:kind:workflow",
    Workflows = "vrdev:element:kind:workflows",
    Configuraion = "vrdev:element:kind:config",
    Configuraions = "vrdev:element:kind:configs",
    Resource = "vrdev:element:kind:resource",
    Resources = "vrdev:element:kind:resources",

    Package = "vrdev:element:kind:package",
    Packages = "vrdev:element:kind:packages",

    Inventory = "vrdev:element:kind:inventory",
    InventoryItem = "vrdev:element:kind:inventoryItem",

    Category = "vrdev:element:kind:category",
    Module = "vrdev:element:kind:module",
    Folder = "vrdev:element:kind:folder"
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
