/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"

export interface ProjectType extends vscode.QuickPickItem {
    id: "vro-ts" | "vro-js" | "vro-xml" | "vro-mixed" | "vra-yaml" | "vra-vro" | "vra-ng"
    containsWorkflows: boolean
}

export interface ProjectPickInfo {
    projectType: ProjectType
    groupId: string
    name: string
    workflowsPath?: string
    destination?: vscode.Uri
}
