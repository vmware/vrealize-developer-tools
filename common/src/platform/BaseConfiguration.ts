/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { MavenProfile, MavenProfilesMap } from "../maven"
import { VrealizeSettings } from "../types"

export abstract class BaseConfiguration {
    vrdev: VrealizeSettings
    allProfiles: MavenProfilesMap | undefined

    hasActiveProfile(): boolean {
        try {
            return !!this.getActiveProfileImpl()
        } catch (e) {
            return false
        }
    }

    get activeProfile(): MavenProfileWrapper {
        return this.getActiveProfileImpl()
    }

    private getActiveProfileImpl(): MavenProfileWrapper {
        const profileName = this.vrdev.maven.profile

        if (!profileName) {
            throw new Error("There is no currently active maven profile. Set the 'vrdev.maven.profile' setting")
        }

        if (!this.allProfiles) {
            throw new Error("There are no vRO profiles in ~/.m2/settings.xml")
        }

        const profile = this.allProfiles[profileName]

        if (!profile) {
            throw new Error(`Could not find profile '${profileName}' in ~/.m2/settings.xml`)
        }

        return new MavenProfileWrapper(profile)
    }
}

export class MavenProfileWrapper {
    constructor(private profile: MavenProfile) {}

    get(key: keyof MavenProfile): string {
        const value = this.profile[key]
        if (!value) {
            throw new Error(`Missing '${key}' property in the configured maven profile.`)
        }

        return value
    }

    getOptional(key: keyof MavenProfile, defaultValue: string): string {
        if (!this.profile) {
            return defaultValue
        }

        return this.profile[key] || defaultValue
    }
}
