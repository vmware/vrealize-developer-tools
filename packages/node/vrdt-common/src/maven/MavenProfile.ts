/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

export interface MavenProfilesMap {
    [id: string]: MavenProfile
}

export interface MavenProfile extends Partial<Record<MavenProfileKeys, string>> {
    id: string
}

type MavenProfileKeys = VroProfileKeys | VraProfileKeys
type VroProfileKeys =
    | "vro.host"
    | "vro.port"
    | "vro.username"
    | "vro.password"
    | "vro.auth"
    | "vro.tenant"
    | "vro.refresh.token"
    | "vro.authHost"
type VraProfileKeys =
    | "vrang.host"
    | "vrang.port"
    | "vrang.username"
    | "vrang.password"
    | "vrang.tenant"
    | "vrang.refresh.token"
