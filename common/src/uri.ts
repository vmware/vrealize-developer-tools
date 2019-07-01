/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { URI } from "vscode-uri"

export const O11N_URI_SCHEME = "o11n"

export interface O11nContentLocation {
    type: string
    path: string
    name: string
    id?: string | null
    extension: string
}

export function locationToUri(location: O11nContentLocation): URI {
    return URI.parse(
        `${O11N_URI_SCHEME}://${location.type}/${location.path}/${location.name}.${location.extension}#${location.id}`
    )
}

export function uriToLocation(uri: URI): O11nContentLocation {
    const { authority, path, fragment } = uri
    const location = path.substring(path.startsWith("/") ? 1 : 0, path.lastIndexOf("/"))
    const name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
    const extension = path.substring(path.lastIndexOf(".") + 1, path.lastIndexOf("#"))

    return {
        type: authority,
        path: location,
        name,
        id: fragment,
        extension
    }
}
