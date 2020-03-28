/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export function isNotEmpty(name: string) {
    return (value: string) => (!value || value.trim() === "" ? `${name} is required` : "")
}

export function isNotEmptyAsync(name: string) {
    return async (value: string) => (!value || value.trim() === "" ? `${name} is required` : "")
}
