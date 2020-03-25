/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as request from "request-promise-native"

import { VraNgAuth } from "./auth"
import { VraAuthType } from "../types"
import { Blueprint, PagedResult, Project, Token } from "./vra-api"

const VMWARE_CLOUD_HOST = "www.mgmt.cloud.vmware.com"
const VMWARE_CLOUD_CSP = "console.cloud.vmware.com"

export interface AuthGrant {
    type: VraAuthType
    accessToken?: string

    // refresh_token
    refreshToken?: string

    // client_credentials
    clientId?: string
    clientSecret?: string

    // password
    orgId?: string
    username?: string
    password?: string
}

export interface VraIdentityMediator {
    write(host: string, token: Token): Promise<void>
    read(host: string): Promise<AuthGrant | undefined>
}

export class VraNgRestClient {
    constructor(private host: string,
                private port: number,
                private identityMediator: VraIdentityMediator) {
        // empty
    }

    private async send<T = any>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        route: string,
        options?: Partial<request.OptionsWithUrl>,
        skipAuth: boolean = false
    ): Promise<T> {
        const url = route.indexOf("://") > 0 ? route : `https://${this.host}:${this.port}/${route}`
        const auth = skipAuth ? undefined : { ...(await this.getAuth()) }
        return request({
            headers: {
                Accept: "application/json"
            },
            json: true,
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            ...options,
            method,
            url,
            auth
        })
    }

    private async getAuth(): Promise<object> {
        const baseUrl = this.host === VMWARE_CLOUD_HOST ? `https://${VMWARE_CLOUD_CSP}` : `https://${this.host}:${this.port}`
        const grant = await this.identityMediator.read(this.host)

        if (!grant) {
            return Promise.reject("Missing vRA authentication configuration")
        }

        if (grant.accessToken) {
            return new VraNgAuth(grant.accessToken).toRequestJson()
        }

        const cspAuthUrl = `/csp/gateway/am/api/auth/authorize?grant_type=${grant.type}`
        const cspOnPremPassUrl = "/csp/gateway/am/api/login?access_token"

        let uri: string
        let body: any = {}

        switch (grant.type) {
            case "refresh_token": {
                uri = `${baseUrl}${cspAuthUrl}&refresh_token=${grant.refreshToken}`
                break
            }
            case "password": {
                if (this.isOnPrem(baseUrl)) {
                    uri = `${baseUrl}${cspOnPremPassUrl}`
                    body = {
                        username: grant.username,
                        password: grant.password
                    }
                } else {
                    uri = `${baseUrl}${cspAuthUrl}&orgId=${grant.orgId}&username=${grant.username}&password=${grant.password}`
                }
                break
            }
            default: {
                throw new Error(`Unsupported authentication type: ${grant.type}`)
            }
        }

        const tokenResponse: Token = await this.send("POST", uri, { body }, true)
        await this.identityMediator.write(this.host, tokenResponse)
        return new VraNgAuth(tokenResponse.access_token).toRequestJson()
    }

    private async isOnPrem(baseUrl: string): Promise<boolean> {
        try {
            const deployment = (
                await this.send("GET", `${baseUrl}/automation-ui/config.json`, undefined, true)
            ).deployment

            return deployment == "onprem"
        } catch {
            return false
        }
    }

    private async unwrapPages<A>(payload: PagedResult<A>, uri: string): Promise<A[]> {
        if (!payload.pageable.paged) {
            return payload.content
        }

        if (!uri.endsWith("/")) {
            uri += "/"
        }

        const result: A[] = []
        result.push(...payload.content)

        while (payload.pageable.pageNumber < payload.totalPages) {
            const nextPage = payload.pageable.pageNumber + 1
            const skipElements = nextPage * payload.pageable.pageSize
            payload = await this.send("GET", `${uri}?$skip=${skipElements}`)
            result.push(...payload.content)
        }

        return result
    }

    // -----------------------------------------------------------
    // Blueprint related APIs ------------------------------------
    // -----------------------------------------------------------

    async getBlueprintById(id: string): Promise<Blueprint> {
        return await this.send("GET", `/blueprint/api/blueprints/${id}`)
    }

    async getBlueprints(): Promise<Blueprint[]> {
        const blueprints: PagedResult<Blueprint> = await this.send("GET", "/blueprint/api/blueprints")
        return await this.unwrapPages(blueprints, "/blueprint/api/blueprints")
    }

    async createBlueprint(body: {name: string, projectId: string, content: string}): Promise<void> {
        await this.send("POST", "/blueprint/api/blueprints", {body})
    }

    async updateBlueprint(id:string, body: {name: string, projectId: string, content: string}): Promise<void> {
        await this.send("PUT", `/blueprint/api/blueprints/${id}`, {body})
    }

    async deployBlueprint(body: {deploymentName: string, projectId: string, content: string}): Promise<void> {
        await this.send("POST", "/blueprint/api/blueprint-requests", { body })
    }

    async getProjects(): Promise<Project[]> {
        const projects: { content: Project[] } = await this.send("GET", "/iaas/api/projects")
        return projects.content
    }
}
