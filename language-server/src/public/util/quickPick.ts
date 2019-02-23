/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroElementPickInfo } from "vrealize-common"

import { vmw } from "../../proto"

export function ofActionInPath(action: vmw.pscoe.hints.IAction, path: string): VroElementPickInfo {
    return {
        path,
        kind: "action",
        name: action.name || "",
        label: `$(file-code) ${action.name}`,
        description: `v${action.version}`,
        id: `${path}/${action.name}`
    }
}

export function ofModule(module: vmw.pscoe.hints.IModule): VroElementPickInfo {
    return {
        kind: "module",
        name: module.name || "",
        label: `$(gift) ${module.name}`,
        description: `${module.actions ? module.actions.length : 0} actions`
    }
}

export function ofActionInModule(action: vmw.pscoe.hints.IAction,
                                 module: vmw.pscoe.hints.IModule): VroElementPickInfo {
    return {
        kind: "action",
        label: `$(file-code) ${module.name}/${action.name}`,
        description: `v${action.version}`,
        name: action.name || "",
        path: module.name,
        id: `${module.name}/${action.name}`
    }
}

export function ofConfigInPath(config: vmw.pscoe.hints.IConfig, path: string): VroElementPickInfo {
    return {
        path,
        kind: "configuration",
        name: config.name || "",
        label: `$(gear) ${config.name}`,
        description: `v${config.version}`,
        id: config.uuid
    }
}

export function ofCategory(category: vmw.pscoe.hints.IConfigCategory): VroElementPickInfo {
    return {
        kind: "category",
        name: category.path || "",
        label: `$(file-directory) ${category.path}`,
        description: `${category.configurations ? category.configurations.length : 0} configuration elements`
    }
}

export function ofConfigInCategory(config: vmw.pscoe.hints.IConfig,
                                   category: vmw.pscoe.hints.IConfigCategory): VroElementPickInfo {
    return {
        kind: "configuration",
        label: `$(gear) ${category.path}/${config.name}`,
        description: `v${config.version}`,
        name: config.name || "",
        path: category.path,
        id: config.uuid
    }
}
