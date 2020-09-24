/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as URL from "url"

const fileSchemeLength = "file://".length - 1

export function pathToUrl(path: string): string {
    return URL.format(URL.parse(`file://${path}`))
}

export function urlToPath(uri: string): string {
    return uri.substr(fileSchemeLength)
}
