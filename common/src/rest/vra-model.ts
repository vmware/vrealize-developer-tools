/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export type Blueprint = {
    id: string
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string
    orgId: string
    projectId: string
    projectName: string
    selfLink: string
    name: string
    description: string
    status: string
    content: string
    valid: boolean
    validationMessages: string[]
    totalVersions: number
    totalReleasedVersions: number
    requestScopeOrg: boolean
    contentSourceSyncMessages: string[]
}

export type Deployment = {
    blueprintId: string
    createdAt: Date
    createdBy: string
    updatedAt: Date
    updatedBy: string
    deploymentId: string
    deploymentName: string
    id: string
    orgId: string
    projectId: string
    projectName: string
    status: string
    destroy: boolean
}

export type Project = {
    description: string
    organizationId: string
    name: string
    id: string
}

export interface PagedResult<T> {
    content: T[]
    pageable: {
        sort: { sorted: boolean; unsorted: boolean; empty: boolean }
        offset: number
        pageSize: number
        pageNumber: number
        unpaged: boolean
        paged: boolean
    }
    totalElements: number
    totalPages: number
    last: boolean
    first: boolean
    size: number
    number: number
    numberOfElements: number
    empty: boolean
}

export interface Token {
    token_type: string
    expires_in: number
    access_token: string
    refresh_token: string
}
