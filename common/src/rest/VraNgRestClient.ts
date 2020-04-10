/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as request from "request-promise-native"

import { VraNgAuth } from "./auth"
import { VraAuthType } from "../types"
import { Blueprint, Deployment, PagedResult, Project, Token } from "./vra-model"

const VMWARE_CLOUD_HOST = "www.mgmt.cloud.vmware.com"
const VMWARE_CLOUD_CSP = "console.cloud.vmware.com"

export interface TokenPair {
    accessToken?: string // undefined when expired
    refreshToken?: string
}

export class AuthGrant implements TokenPair {
    constructor(
        public readonly type: VraAuthType,
        public readonly refreshToken?: string,
        public readonly clientId?: string,
        public readonly clientSecret?: string,
        public readonly username?: string,
        public readonly password?: string,
        public readonly orgId?: string
    ) {
        // empty
    }

    static RefreshToken(refreshToken: string) {
        return new AuthGrant("refresh_token", refreshToken)
    }

    static Password(username: string, password: string, orgId?: string) {
        return new AuthGrant("password", undefined, undefined, undefined, username, password, orgId)
    }

    ClientCredentials(clientId: string, clientSecret: string) {
        return new AuthGrant("password", undefined, clientId, clientSecret)
    }
}

export interface VraIdentityIO {
    write(host: string, token: Token): Promise<void>
    read(host: string): Promise<TokenPair | undefined>
}

export class VraNgRestClient {
    constructor(private host: string, private port: number, private identity: VraIdentityIO) {
        if (host === VMWARE_CLOUD_CSP) {
            // CSP is only for identity operations, switch to management portal
            this.host = VMWARE_CLOUD_HOST
        }

        if (!port || port <= 0) {
            this.port = 443
        }
    }

    private async send<T = any>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        route: string,
        options?: Partial<request.OptionsWithUrl>,
        skipAuth: boolean = false
    ): Promise<T> {
        const url = route.indexOf("://") > 0 ? route : `https://${this.host}:${this.port}/${route.replace(/^\//, "")}`
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
        const token = await this.identity.read(this.host)

        if (!token) {
            return Promise.reject("Missing vRA authentication configuration")
        }

        if (token.accessToken) {
            return new VraNgAuth(token.accessToken).toRequestJson()
        }

        if (!token.refreshToken) {
            return Promise.reject("Missing refresh token for an expired access token")
        }

        const tokenResponse: Token = await this.login(AuthGrant.RefreshToken(token.refreshToken))
        return new VraNgAuth(tokenResponse.access_token).toRequestJson()
    }

    private async isOnPrem(baseUrl: string): Promise<boolean> {
        try {
            const deployment = (await this.send("GET", `${baseUrl}/automation-ui/config.json`, undefined, true))
                .deployment

            return deployment == "onprem"
        } catch {
            return false
        }
    }

    private async unwrapPages<A>(payload: PagedResult<A>, uri: string): Promise<A[]> {
        if (!payload.pageable.paged || payload.numberOfElements <= payload.totalElements) {
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

    async login(grant: AuthGrant): Promise<Token> {
        const baseUrl =
            this.host === VMWARE_CLOUD_HOST ? `https://${VMWARE_CLOUD_CSP}` : `https://${this.host}:${this.port}`
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
        await this.identity.write(this.host, tokenResponse)
        return tokenResponse
    }

    async getLoggedInUser(): Promise<any> {
        const baseUrl = this.host === VMWARE_CLOUD_HOST ? `https://${VMWARE_CLOUD_CSP}` : ""
        const uri = `${baseUrl}/csp/gateway/am/api/loggedin/user`
        return this.send("GET", uri)
    }

    // -----------------------------------------------------------
    // Blueprint related APIs ------------------------------------
    // -----------------------------------------------------------

    async getBlueprintById(id: string): Promise<Blueprint> {
        return this.send("GET", `/blueprint/api/blueprints/${id}`)
    }

    async getBlueprintByName(name: string): Promise<Blueprint | undefined> {
        const blueprints: PagedResult<Blueprint> = await this.send("GET", `/blueprint/api/blueprints?name=${name}`)
        return (await this.unwrapPages(blueprints, ""))[0]
    }

    async getBlueprints(): Promise<Blueprint[]> {
        const blueprints: PagedResult<Blueprint> = await this.send("GET", "/blueprint/api/blueprints")
        return this.unwrapPages(blueprints, "/blueprint/api/blueprints")
    }

    async createBlueprint(body: { name: string; projectId: string; content: string }): Promise<any> {
        return this.send("POST", "/blueprint/api/blueprints", { body })
    }

    async updateBlueprint(id: string, body: { name: string; projectId: string; content: string }): Promise<void> {
        return this.send("PUT", `/blueprint/api/blueprints/${id}`, { body })
    }

    async deployBlueprint(body: {
        deploymentName: string
        projectId: string
        blueprintId?: string
        content?: string
    }): Promise<Deployment> {
        return this.send("POST", "/blueprint/api/blueprint-requests", { body })
    }

    async getProjects(): Promise<Project[]> {
        const projects: { content: Project[] } = await this.send("GET", "/iaas/api/projects")
        return projects.content
    }
}
