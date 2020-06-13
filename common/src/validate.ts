/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export function isNotEmpty(name: string): (string) => [boolean, string | undefined] {
    return (value: string) => (!value || value.trim() === "" ? [false, `${name} is required`] : [true, undefined])
}
