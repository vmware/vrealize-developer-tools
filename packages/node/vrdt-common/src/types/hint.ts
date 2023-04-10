/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export interface HintModule {
    id: string
    name: string
    actions: HintAction[]
}

export interface HintAction {
    id?: string
    name: string
    version?: string
    description?: string
    returnType?: string
    parameters: ActionParameters[]
    categoryId?: string
    moduleName?: string
}

export interface ActionParameters {
    name: string
    type?: string
    description?: string
    version?: string
    returnType?: string
}

export interface HintPlugin {
    description?: string
    name: string
    version?: string
    build?: number
    detailsLink: string
}
