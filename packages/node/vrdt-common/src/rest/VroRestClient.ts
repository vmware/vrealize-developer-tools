/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as http from "http"

import * as fs from "fs-extra"
import * as request from "request-promise-native"

import { ApiCategoryType } from "../types"
import { BaseConfiguration } from "../platform"
import { Auth, BasicAuth, VraSsoAuth } from "./auth"
import {
    Action,
    ApiElement,
    Configuration,
    ContentChildrenResponse,
    ContentLinksResponse,
    InventoryElement,
    LinkItem,
    LogMessage,
    Resource,
    Version,
    Workflow,
    WorkflowLogsResponse,
    WorkflowParam,
    WorkflowState
} from "./vro-model"
import { Logger, promise, sleep } from ".."
import { HintAction, HintModule } from "../types/hint"

export class VroRestClient {
    private readonly logger = Logger.get("VroRestClient")
    private auth: Record<string, unknown> | PromiseLike<Record<string, unknown>>
    private hintActions: Map<string, HintAction[] | undefined> = new Map<string, HintAction[]>()
    private rootElements: Map<ApiCategoryType, ApiElement[] | undefined> = new Map<ApiCategoryType, ApiElement[]>()
    private childElements: Map<string, ApiElement[] | undefined> = new Map<string, ApiElement[]>()
    private actions: Action[] = []
    private workflows: Workflow[] = []
    private configurations: Configuration[] = []
    private resources: Resource[] = []
    private isCachingEnabled: boolean

    constructor(private settings: BaseConfiguration) {
        this.auth = this.getInitialAuth()
        this.loadCacheConfiguration()
    }

    private get hostname(): string {
        return this.settings.activeProfile.get("vro.host")
    }

    private get vroAuthHost(): string {
        return this.settings.activeProfile.get("vro.authHost")
    }

    private get vrangHost(): string {
        return this.settings.activeProfile.get("vrang.host")
    }

    private get vroUsername(): string {
        return this.settings.activeProfile.getOptional("vro.username", "")
    }

    private get vroPassword(): string {
        return this.settings.activeProfile.getOptional("vro.password", "")
    }

    private get refreshToken(): string {
        return this.settings.activeProfile.getOptional("vro.refresh.token", "")
    }

    private get port(): number {
        return parseInt(this.settings.activeProfile.getOptional("vro.port", "8281"), 10)
    }

    private get authMethod(): string {
        return this.settings.activeProfile.getOptional("vro.auth", "basic")
    }

    private async getAuth(): Promise<Record<string, unknown>> {
        return await this.auth
    }

    private async getInitialAuth(): Promise<Record<string, unknown>> {
        this.logger.info("Initial authentication...")
        let auth: Auth

        await sleep(3000) // to properly initialize the components

        let refreshToken = this.refreshToken
        switch (this.authMethod.toLowerCase()) {
            case "vra":
                this.logger.info(`Token authentication chosen...`)
                if (this.vroUsername && this.vroPassword) {
                    refreshToken = await this.getRefreshToken(this.vroUsername, this.vroPassword)
                }
                this.logger.debug(`Refresh token: ${refreshToken}`)
                auth = new VraSsoAuth(await this.getBearerToken(refreshToken))
                break
            case "basic":
                this.logger.info(`Basic authentication chosen...`)
                auth = new BasicAuth(this.vroUsername, this.vroPassword)
                break
            default:
                throw new Error(`Unsupported authentication mechanism: ${this.authMethod}`)
        }

        return auth.toRequestJson()
    }

    async getBearerToken(refreshToken: string): Promise<string> {
        if (!refreshToken) {
            throw new Error("Refresh token not provided")
        }

        this.logger.info("Generating Bearer token...")
        const uri =
            this.authMethod.toLowerCase() === "vra"
                ? `https://${this.vrangHost}:${this.port}/iaas/api/login`
                : `https://${this.hostname}:${this.port}/iaas/api/login`

        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            body: {
                refreshToken: refreshToken
            },
            json: true,
            method: "POST",
            uri
        }
        const bearerToken = await request(options)
        this.logger.debug(`Bearer token: ${bearerToken.token}`)

        return bearerToken.token
    }

    async getRefreshToken(username: string, password: string) {
        if (!username || !password) {
            throw new Error("Username or password not provided")
        }

        this.logger.info("Username and password provided in the profile. Generating Refresh token...")
        if (this.vroAuthHost.toLowerCase() === "console.cloud.vmware.com") {
            throw new Error(
                "For Cloud vRO, the token must be generated via the cloud management console (https://console.cloud.vmware.com). Please remove the fields 'vro.username' and 'vro.password' from the profile and add 'vro.refresh.token'"
            )
        }
        const uri = `https://${this.vroAuthHost}:${this.port}/csp/gateway/am/api/login?access_token`
        const domain = username.split("@")[1]
        username = username.split("@")[0]

        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/json"
            },
            body: {
                username: username,
                password: password,
                domain: domain || undefined
            },
            json: true,
            method: "POST",
            uri
        }
        const refreshToken = await request(options)

        return refreshToken.refresh_token
    }

    private async send<T = any>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        route: string,
        options?: Partial<request.OptionsWithUrl>
    ): Promise<T> {
        const url = route.indexOf("://") > 0 ? route : `https://${this.hostname}:${this.port}/vco/api/${route}`
        // reload the cache configuration in order cache to take effect when settings are changed
        this.loadCacheConfiguration()
        return request({
            headers: {
                "Accept": "application/json",
                "Connection": "keep-alive",
                "Cache-Control": "no-cache"
            },
            json: true,
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            ...options,
            method,
            url,
            auth: { ...(await this.getAuth()) }
        })
    }

    async getVersion(): Promise<Version> {
        return this.send("GET", "about")
    }

    async getWorkflow(id: string): Promise<any> {
        return this.send("GET", `workflows/${id}`)
    }

    async getAction(id: string): Promise<any> {
        return this.send("GET", `actions/${id}`)
    }

    async getConfiguration(id: string): Promise<any> {
        return this.send("GET", `configurations/${id}`)
    }

    async executeWorkflow(id: string, ...inputParams: WorkflowParam[]): Promise<WorkflowParam[]> {
        const token: string = await this.startWorkflow(id, ...inputParams)
        let response = await this.getWorkflowExecution(id, token)
        while (response.state === "running") {
            await sleep(1000)
            response = await this.getWorkflowExecution(id, token)
        }

        return response["output-parameters"]
    }

    async getWorkflowExecution(id: string, token: string): Promise<any> {
        return this.send("GET", `workflows/${id}/executions/${token}`)
    }

    async getWorkflowExecutionState(id: string, token: string): Promise<WorkflowState> {
        const response = await this.send("GET", `workflows/${id}/executions/${token}`, {
            resolveWithFullResponse: false
        })

        return response.state
    }

    async startWorkflow(id: string, ...inputParams: WorkflowParam[]): Promise<string> {
        const executeOptions = {
            body: {} as any,
            resolveWithFullResponse: true
        }

        if (inputParams.length > 0) {
            executeOptions.body.parameters = []
            for (const param of inputParams) {
                executeOptions.body.parameters.push({
                    ...param,
                    scope: "local"
                })
            }
        }
        const execResponse = await this.send("POST", `workflows/${id}/executions`, executeOptions)
        if (execResponse.statusCode !== 202) {
            throw new Error(`Expected status code 202, but got ${execResponse.statusCode}`)
        }

        let location: string | undefined = execResponse.headers.location
        if (!location) {
            throw new Error(`Missing location header in the response of POST /workflows/${id}/executions`)
        }
        location = location.replace(/\/$/, "") // remove trailing slash
        const execToken = location.substring(location.lastIndexOf("/") + 1)

        return execToken
    }

    async getWorkflowLogsPre76(
        workflowId: string,
        executionId: string,
        severity: string,
        timestamp: number
    ): Promise<LogMessage[]> {
        const executeOptions = {
            body: {
                "severity": severity,
                "older-than": timestamp
            }
        }

        const response: WorkflowLogsResponse = await this.send(
            "POST",
            `workflows/${workflowId}/executions/${executionId}/syslogs`,
            executeOptions
        )

        const messages: LogMessage[] = []
        for (const log of response.logs) {
            const e = log.entry
            const description = e["long-description"] ? e["long-description"] : e["short-description"]
            if (
                e.origin === "server" || // skip server messages, as they are always included in the result
                description.indexOf("*** End of execution stack.") > 0 ||
                description.startsWith("__item_stack:/")
            ) {
                continue
            }
            messages.push({
                timestamp: e["time-stamp"],
                severity: e.severity,
                description
            })
        }

        return messages
    }

    async getWorkflowLogsPost76(
        workflowId: string,
        executionId: string,
        severity: string,
        timestamp: number
    ): Promise<LogMessage[]> {
        const response: WorkflowLogsResponse = await this.send(
            "GET",
            `workflows/${workflowId}/executions/${executionId}/syslogs` +
                `?conditions=severity=${severity}` +
                `&conditions=timestamp${encodeURIComponent(">")}${timestamp}` // + "&conditions=type=system"
        )

        const messages: LogMessage[] = []
        for (const log of response.logs) {
            const e = log.entry
            const description = e["long-description"] ? e["long-description"] : e["short-description"]
            if (description.indexOf("*** End of execution stack.") > 0 || description.startsWith("__item_stack:/")) {
                continue
            }
            messages.push({
                timestamp: e["time-stamp"],
                severity: e.severity,
                description
            })
        }

        return messages
    }

    async importPackage(path: string): Promise<void> {
        return this.send("POST", "content/packages?overwrite=true", {
            formData: {
                file: [fs.createReadStream(path)]
            },
            resolveWithFullResponse: true
        })
    }

    async deletePackage(
        name: string,
        option: "deletePackage" | "deletePackageWithContent" | "deletePackageKeepingShared"
    ): Promise<void> {
        return this.send("DELETE", `packages/${name}/?option=${option}`, {
            resolveWithFullResponse: true
        })
    }

    async getPlugins(): Promise<any> {
        return this.send("GET", "plugins")
    }

    async getPackages(): Promise<string[]> {
        const responseJson: ContentLinksResponse = await this.send("GET", "packages")
        const packages: string[] = responseJson.link
            .map(pkg => {
                const name = pkg.attributes.find(att => att.name === "name")
                return name ? name.value : undefined
            })
            .filter(val => val !== undefined) as string[]

        return packages.sort((x, y) => x.localeCompare(y))
    }

    async getActions(): Promise<Action[]> {
        // return the cached actions (if any) if caching is enabled
        if (this.isCachingEnabled && this.actions && Array.isArray(this.actions) && this.actions.length) {
            return this.actions
        }

        const responseJson: ContentLinksResponse = await this.send("GET", "actions")
        const actions: { fqn: string; id: string; version: string }[] = responseJson.link
            .map(action => {
                if (!action.attributes) {
                    return undefined
                }
                const fqn = action.attributes.find(att => att.name === "fqn")
                const id = action.attributes.find(att => att.name === "id")
                const version = action.attributes.find(att => att.name === "version")

                return {
                    fqn: fqn ? fqn.value : undefined,
                    id: id ? id.value : undefined,
                    version: version ? version.value : undefined
                }
            })
            .filter(val => {
                return !!val && val.fqn !== undefined && val.id !== undefined
            }) as { fqn: string; id: string; version: string }[]

        actions.sort((x, y) => x.fqn.localeCompare(y.fqn))
        // cache the actions in order not to overload vRO if caching is enabled
        if (this.isCachingEnabled) {
            this.actions = actions
        }

        return this.actions
    }

    async getWorkflows(): Promise<Workflow[]> {
        // return the cached workflows (if any) if caching is enabled
        if (this.isCachingEnabled && this.workflows && Array.isArray(this.workflows) && this.workflows.length) {
            return this.workflows
        }

        const responseJson: ContentLinksResponse = await this.send("GET", "workflows")
        const workflows: { name: string; id: string; version: string }[] = responseJson.link
            .map(wf => {
                if (!wf.attributes) {
                    return undefined
                }

                const name = wf.attributes.find(att => att.name === "name")
                const id = wf.attributes.find(att => att.name === "id")
                const version = wf.attributes.find(att => att.name === "version")

                return {
                    name: name ? name.value : undefined,
                    id: id ? id.value : undefined,
                    version: version ? version.value : undefined
                }
            })
            .filter(val => {
                return !!val && val.name !== undefined && val.id !== undefined
            }) as { name: string; id: string; version: string }[]

        workflows.sort((x, y) => x.name.localeCompare(y.name))
        // cache the workflows if caching is enabled
        if (this.isCachingEnabled) {
            this.workflows = workflows
        }

        return workflows
    }

    async getConfigurations(): Promise<Configuration[]> {
        // return the cached configurations (if any) if caching is enabled
        if (
            this.isCachingEnabled &&
            this.configurations &&
            Array.isArray(this.configurations) &&
            this.configurations.length
        ) {
            return this.configurations
        }

        const responseJson: ContentLinksResponse = await this.send("GET", "configurations")
        const configs: { name: string; id: string; version: string }[] = responseJson.link
            .map(conf => {
                if (!conf.attributes) {
                    return undefined
                }
                const name = conf.attributes.find(att => att.name === "name")
                const id = conf.attributes.find(att => att.name === "id")
                const version = conf.attributes.find(att => att.name === "version")

                return {
                    name: name ? name.value : undefined,
                    id: id ? id.value : undefined,
                    version: version ? version.value : undefined
                }
            })
            .filter(val => {
                return !!val && val.name !== undefined && val.id !== undefined
            }) as { name: string; id: string; version: string }[]
        configs.sort((x, y) => x.name.localeCompare(y.name))

        // cache the configurations if caching is enabled
        if (this.isCachingEnabled) {
            this.configurations = configs
        }

        return configs
    }

    async getResources(): Promise<Resource[]> {
        // return the cached resources (if any) if caching is enabled
        if (this.isCachingEnabled && this.resources && Array.isArray(this.resources) && this.resources.length) {
            return this.resources
        }

        const responseJson: ContentLinksResponse = await this.send("GET", "resources")
        const resources: { name: string; id: string }[] = responseJson.link
            .map(res => {
                if (!res.attributes) {
                    return undefined
                }
                const name = res.attributes.find(att => att.name === "name")
                const id = res.attributes.find(att => att.name === "id")

                return {
                    name: name ? name.value : undefined,
                    id: id ? id.value : undefined
                }
            })
            .filter(val => {
                return !!val && val.name !== undefined && val.id !== undefined
            }) as { name: string; id: string }[]

        resources.sort((x, y) => x.name.localeCompare(y.name))

        // cache the resources if caching is enabled
        if (this.isCachingEnabled) {
            this.resources = resources
        }

        return resources
    }

    async getRootCategories(categoryType: ApiCategoryType): Promise<ApiElement[]> {
        // return cached hint root elements (if any) in order to not overload vRO if caching is enabled
        if (
            this.isCachingEnabled &&
            this.rootElements?.has(categoryType) &&
            Array.isArray(this.rootElements?.get(categoryType))
        ) {
            return this.childElements?.get(categoryType) as ApiElement[]
        }

        const responseJson: ContentLinksResponse = await this.send(
            "GET",
            `categories?isRoot=true&categoryType=${categoryType}`
        )
        const categories = responseJson.link
            .map((item: LinkItem) => {
                const name = item.attributes.find(att => att.name === "name")
                const id = item.attributes.find(att => att.name === "id")
                return {
                    name: name?.value ?? undefined,
                    id: id?.value ?? undefined,
                    type: categoryType,
                    rel: item?.rel,
                    description: item?.description?.value ?? undefined
                }
            })
            .filter(item => {
                return item.name !== undefined && item.id !== undefined
            }) as ApiElement[]

        categories.sort((x, y) => x.name.localeCompare(y.name))

        // cache the hint root elements in order not to overload vRO REST API if caching is enabled
        if (this.isCachingEnabled) {
            this.childElements.set(categoryType, categories)
        }

        return categories
    }

    async getChildrenOfCategory(categoryId: string): Promise<ApiElement[]> {
        // return cached hint child elements (if any) in order to not overload vRO if caching is enabled
        if (
            this.isCachingEnabled &&
            this.childElements?.has(categoryId) &&
            Array.isArray(this.childElements?.get(categoryId))
        ) {
            return this.childElements?.get(categoryId) as ApiElement[]
        }

        const responseJson: ContentChildrenResponse = await this.send("GET", `categories/${categoryId}`)
        const children = responseJson.relations.link
            .map(child => {
                if (!child.attributes) {
                    return undefined
                }
                const name = child.attributes.find(att => att.name === "name")
                const id = child.attributes.find(att => att.name === "id")
                const type = child.attributes.find(att => att.name === "type")

                return {
                    name: name ? name.value : undefined,
                    id: id ? id.value : undefined,
                    type: type ? type.value : undefined,
                    rel: child.rel
                }
            })
            .filter(val => {
                return !!val && val.name !== undefined && val.id !== undefined && val.type !== undefined
            }) as ApiElement[]

        children.sort((x, y) => x.name.localeCompare(y.name))

        // cache the hint child elements in order not to overload vRO REST API if caching is enabled
        if (this.isCachingEnabled) {
            this.childElements.set(categoryId, children)
        }

        return children
    }

    async getChildrenOfCategoryWithDetails(categoryId: string): Promise<HintAction[]> {
        // return cached hint actions (if any) in order to not overload vRO REST API if caching is enabled
        if (
            this.isCachingEnabled &&
            this.hintActions?.has(categoryId) &&
            Array.isArray(this.hintActions?.get(categoryId))
        ) {
            return this.hintActions?.get(categoryId) as HintAction[]
        }

        let responseJson: HintModule = {
            id: "",
            name: "",
            actions: []
        }
        try {
            responseJson = await this.send("GET", `server-configuration/api/category/${categoryId}`)
        } catch (error) {
            this.logger.error(`Error occurred: ${error}`)
        }

        if (!responseJson) {
            return []
        }

        const children: HintAction[] = responseJson.actions.map(child => {
            return {
                name: child.name ?? undefined,
                id: child.id ?? undefined,
                returnType: child.returnType ?? undefined,
                description: child.description ?? undefined,
                version: child.version ?? undefined,
                categoryId: child.categoryId ?? undefined,
                parameters: child.parameters || []
            } as HintAction
        })
        children.sort((x, y) => x.name.localeCompare(y.name))
        // cache the hint actions in order not to overload vRO REST API if caching is enabled in config
        if (this.isCachingEnabled) {
            this.hintActions.set(categoryId, children)
        }

        return children
    }

    async getResource(id: string): Promise<http.IncomingMessage> {
        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: true,
            rejectUnauthorized: false,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/resources/${id}`,
            auth: { ...(await this.getAuth()) },
            json: false,
            headers: {
                Accept: "application/octet-stream"
            }
        }

        return promise.requestPromiseStream(options)
    }

    async getResourceInfo(id: string): Promise<any> {
        return this.send("GET", `resources/${id}`)
    }

    async getInventoryItem(href: string): Promise<any> {
        return this.send("GET", href)
    }

    async getInventoryItems(href?: string): Promise<InventoryElement[]> {
        const responseJson: ContentChildrenResponse = await this.send("GET", href ?? "inventory")
        const children = responseJson.relations.link
            .map(child => {
                if (!child.attributes) {
                    return undefined
                }
                const id =
                    child.attributes.find(att => att.name === "id") ??
                    child.attributes.find(att => att.name === "dunesId")
                const name =
                    child.attributes.find(att => att.name === "displayName") ??
                    child.attributes.find(att => att.name === "name")
                const type =
                    child.attributes.find(att => att.name === "type") ??
                    child.attributes.find(att => att.name === "@type")

                return {
                    name: name ? name.value : undefined,
                    id: id ? id.value : undefined,
                    type: type ? type.value : undefined,
                    rel: child.rel,
                    href: child.href
                }
            })
            .filter(val => {
                return !!val && val.name !== undefined && val.href !== undefined
            }) as InventoryElement[]

        return children.sort((x, y) => x.name.localeCompare(y.name))
    }

    async fetchIcon(namespace: string, type: string, targetPath: string): Promise<void> {
        type = type || ""
        const url = `https://${this.hostname}:${this.port}/vco/api/catalog/${namespace}/${type}/metadata/icon`
        const options = {
            headers: {
                Accept: "application/json"
            },
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            json: false,
            method: "GET",
            url,
            auth: { ...(await this.getAuth()) }
        }

        const stream = request(options).pipe(fs.createWriteStream(targetPath))
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve())
            stream.on("error", e => reject(e))
        })
    }

    async fetchWorkflowSchema(id: string, targetPath: string): Promise<void> {
        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: true,
            rejectUnauthorized: false,
            headers: {},
            json: false,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows/${id}/schema`,
            auth: { ...(await this.getAuth()) }
        }
        const stream = request(options).pipe(fs.createWriteStream(targetPath))

        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve())
            stream.on("error", e => reject(e))
        })
    }

    async fetchAction(id: string, targetPath: string): Promise<void> {
        const uri = `https://${this.hostname}:${this.port}/vco/api/actions/${id}/`
        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/zip"
            },
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) }
        }

        const stream = request(options).pipe(fs.createWriteStream(targetPath))
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve())
            stream.on("error", e => reject(e))
        })
    }

    async fetchWorkflow(id: string, targetPath: string): Promise<void> {
        const uri = `https://${this.hostname}:${this.port}/vco/api/content/workflows/${id}/`
        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {},
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) }
        }

        const stream = request(options).pipe(fs.createWriteStream(targetPath))
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve())
            stream.on("error", e => reject(e))
        })
    }

    async fetchResource(id: string, targetPath: string): Promise<void> {
        const uri = `https://${this.hostname}:${this.port}/vco/api/resources/${id}/`
        const options = {
            simple: true, // reject non-2xx
            resolveWithFullResponse: false,
            rejectUnauthorized: false,
            headers: {
                Accept: "application/octet-stream"
            },
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) }
        }

        const stream = request(options).pipe(fs.createWriteStream(targetPath))
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve())
            stream.on("error", e => reject(e))
        })
    }

    async getConfigElementXml(id: string): Promise<string> {
        return this.send("GET", `configurations/${id}/`, {
            headers: {
                Accept: "application/vcoobject+xml"
            },
            json: false
        })
    }

    async getVroServerData(): Promise<string> {
        return this.send("GET", "server-configuration/api")
    }

    async getPluginDetails(link: string) {
        return this.send("GET", `server-configuration/api/plugins/${link}`)
    }

    private loadCacheConfiguration(): void {
        this.isCachingEnabled = this.settings?.vrdev?.vro?.inventory?.cache ?? false
    }
}
