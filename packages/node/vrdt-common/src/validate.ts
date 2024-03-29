/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export function isNotEmpty(name: string): (value: string) => [boolean, string | undefined] {
    return (value: string) => (!value || value.trim() === "" ? [false, `${name} is required`] : [true, undefined])
}
