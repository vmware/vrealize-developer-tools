/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { URI } from "vscode-uri"

export class ContentLocation {
    static readonly VRO_URI_SCHEME = "vro"

    protected constructor(
        public scheme: string,
        public type: string, // "action" | "workflow" | "config" | "resource"
        public name: string,
        public id: string,
        public extension: string | undefined
    ) {}

    static from(uri: URI): ContentLocation {
        const { scheme, authority, path } = uri
        const id = path.substring(path.startsWith("/") ? 1 : 0, path.lastIndexOf("/"))
        const name = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."))
        const extension = path.lastIndexOf(".") > -1 ? path.substring(path.lastIndexOf(".") + 1) : undefined

        return new ContentLocation(scheme, authority, name, id, extension)
    }

    static with(components: {
        scheme: string
        type: string
        name: string
        id: string
        extension: string | undefined
    }): ContentLocation {
        return new ContentLocation(
            components.scheme,
            components.type.replace("vrdev:element:kind:", ""),
            components.name.substring(components.name.lastIndexOf("/") + 1),
            components.id,
            components.extension
        )
    }

    static asUri(location: ContentLocation): URI {
        if (location.extension) {
            return URI.parse(
                `${location.scheme}://${location.type}/${location.id}/${location.name}.${location.extension}`
            )
        }
        return URI.parse(`${location.scheme}://${location.type}/${location.id}/${location.name}`)
    }

    toString(): string {
        return ContentLocation.asUri(this).toString()
    }
}
