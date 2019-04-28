/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as http from "http"

import * as fs from "fs-extra"
import * as request from "request-promise-native"

import { Logger, MavenCliProxy, promise, sleep } from ".."

import { ApiCategoryType, ApiElementType } from "../types"
import { BaseConfiguration, BaseEnvironment } from "../platform"
import { Auth, BasicAuth, VraSsoAuth } from "./auth"

export interface WorkflowParam {
    type: string
    name: string
    value: any
}

export interface LogMessage {
    timestamp: string
    severity: string
    description: string
}

export interface Version {
    "version": string
    "build-number": string
    "build-date": string
    "api-version": string
}

export type WorkflowState =
    | "canceled"
    | "completed"
    | "running"
    | "suspended"
    | "waiting"
    | "waiting-signal"
    | "failed"
    | "initializing"

interface WorkflowLogsResponse {
    logs: {
        entry: {
            "origin": string
            "severity": string
            "time-stamp": string
            "short-description": string
            "long-description": string
        }
    }[]
}

interface ApiElement {
    name: string
    id: string
    type: ApiCategoryType | ApiElementType
    rel: string
}

interface InventoryElement {
    name: string
    id: string
    type: string
    rel: string
    href: string
}

interface ContentLinksResponse {
    link: {
        attributes: { name: string; value: string; type: string }[]
        rel: string
        href: string
    }[]
}

interface ContentChildrenResponse {
    href: string
    relations: ContentLinksResponse
}

export class VroRestClient {
    private readonly logger = Logger.get("VroRestClient")

    constructor(private settings: BaseConfiguration, private environment: BaseEnvironment) {
        // empty
    }

    private get hostname(): string {
        return this.settings.activeProfile.get("vro.host")
    }

    private get port(): number {
        return parseInt(this.settings.activeProfile.getOptional("vro.port", "8281"), 10)
    }

    private get authMethod(): string {
        return this.settings.activeProfile.getOptional("vro.auth", "basic")
    }

    private async getAuth(): Promise<object> {
        let auth: Auth
        switch (this.authMethod.toLowerCase()) {
            case "vra":
                const maven = new MavenCliProxy(this.environment, this.settings.vrdev.maven, this.logger)
                auth = new VraSsoAuth(await maven.getToken())
                break
            case "basic":
                auth = new BasicAuth(
                    this.settings.activeProfile.get("vro.username"),
                    this.settings.activeProfile.get("vro.password")
                )
                break
            default:
                throw new Error(`Unsupported authentication mechanism: ${this.authMethod}`)
        }

        return auth.toRequestJson()
    }

    async getVersion(): Promise<Version> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/about`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const execResponse: Version = await request(executeOptions)
        return execResponse
    }

    async getWorkflow(id: string): Promise<any> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows/${id}`,
            auth: { ...(await this.getAuth()) }
        }

        const execResponse = await request(executeOptions)
        return execResponse.body
    }

    async getAction(id: string): Promise<any> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/actions/${id}`,
            auth: { ...(await this.getAuth()) }
        }

        const execResponse = await request(executeOptions)
        return execResponse.body
    }

    async getConfiguration(id: string): Promise<any> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/configurations/${id}`,
            auth: { ...(await this.getAuth()) }
        }

        const execResponse = await request(executeOptions)
        return execResponse.body
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
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows/${id}/executions/${token}`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const response = request(executeOptions)
        return response
    }

    async getWorkflowExecutionState(id: string, token: string): Promise<WorkflowState> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows/${id}/executions/${token}`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const response = await request(executeOptions)
        return response.state
    }

    async startWorkflow(id: string, ...inputParams: WorkflowParam[]): Promise<string> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "POST",
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows/${id}/executions`,
            auth: { ...(await this.getAuth()) },
            body: {} as any
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

        const execResponse = await request(executeOptions)

        if (execResponse.statusCode !== 202) {
            throw new Error(`Expected status code 202, but got ${execResponse.statusCode}`)
        }

        let location: string | undefined = execResponse.headers.location
        if (!location) {
            throw new Error(`Missing location header in the response of ${executeOptions.uri}`)
        }

        location = location.replace(/\/$/, "") // remove trailing slash
        const execToken = location.substring(location.lastIndexOf("/") + 1)
        return execToken
    }

    async getWorkflowLogs(
        workflowId: string,
        executionId: string,
        severity: string,
        timestamp: number
    ): Promise<LogMessage[]> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "POST",
            uri:
                `https://${this.hostname}:${this.port}/vco/api` +
                `/workflows/${workflowId}/executions/${executionId}/syslogs`,
            auth: { ...(await this.getAuth()) },
            body: {
                "severity": severity,
                "older-than": timestamp
            },
            resolveWithFullResponse: false
        }

        const response: WorkflowLogsResponse = await request(executeOptions)
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

    async importPackage(path: string): Promise<void> {
        const executeOptions = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "POST",
            uri: `https://${this.hostname}:${this.port}/vco/api/content/packages?overwrite=true`,
            auth: { ...(await this.getAuth()) },
            formData: {
                file: [fs.createReadStream(path)]
            }
        }

        return request(executeOptions)
    }

    async getPlugins(): Promise<any> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/plugins`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        return request(options)
    }

    async getPackages(): Promise<string[]> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/packages`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentLinksResponse = await request(options)
        const packages: string[] = responseJson.link
            .map(pkg => {
                const name = pkg.attributes.find(att => att.name === "name")
                return name ? name.value : undefined
            })
            .filter(val => val !== undefined) as string[]

        return packages.sort()
    }

    async getActions(): Promise<{ fqn: string; id: string; version: string }[]> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/actions`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentLinksResponse = await request(options)
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

        return actions.sort((x, y) => x.fqn.localeCompare(y.fqn))
    }

    async getWorkflows(): Promise<{ name: string; id: string; version: string }[]> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentLinksResponse = await request(options)
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

        return workflows.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getConfigurations(): Promise<{ name: string; id: string; version: string }[]> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/configurations`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentLinksResponse = await request(options)
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

        return configs.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getResources(): Promise<{ name: string; id: string }[]> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri: `https://${this.hostname}:${this.port}/vco/api/resources`,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentLinksResponse = await request(options)
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

        return resources.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getRootCategories(categoryType: ApiCategoryType): Promise<ApiElement[]> {
        const uri = `https://${this.hostname}:${this.port}/vco/api/categories?isRoot=true&categoryType=${categoryType}`
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentLinksResponse = await request(options)
        const categories = responseJson.link
            .map(child => {
                const name = child.attributes.find(att => att.name === "name")
                const id = child.attributes.find(att => att.name === "id")
                return {
                    name: name ? name.value : undefined,
                    id: id ? id.value : undefined,
                    type: categoryType,
                    rel: child.rel
                }
            })
            .filter(val => {
                return val.name !== undefined && val.id !== undefined
            }) as ApiElement[]

        return categories.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getChildrenOfCategory(categoryId: string): Promise<ApiElement[]> {
        const uri = `https://${this.hostname}:${this.port}/vco/api/categories/${categoryId}`
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentChildrenResponse = await request(options)
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

        return children.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getResource(id: string): Promise<http.IncomingMessage> {
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
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

    async getInventoryItems(href?: string): Promise<InventoryElement[]> {
        const uri = href || `https://${this.hostname}:${this.port}/vco/api/inventory`
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const responseJson: ContentChildrenResponse = await request(options)
        const children = responseJson.relations.link
            .map(child => {
                if (!child.attributes) {
                    return undefined
                }

                const id =
                    child.attributes.find(att => att.name === "id") ||
                    child.attributes.find(att => att.name === "dunesId")

                const name =
                    child.attributes.find(att => att.name === "displayName") ||
                    child.attributes.find(att => att.name === "name")

                const type =
                    child.attributes.find(att => att.name === "type") ||
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
        const uri = `https://${this.hostname}:${this.port}/vco/api/catalog/${namespace}/${type}/metadata/icon`
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
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
            ...DEFAULT_REQUEST_OPTIONS,
            headers: {
                Accept: "application/zip"
            },
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
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
            ...DEFAULT_REQUEST_OPTIONS,
            headers: {},
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
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
            ...DEFAULT_REQUEST_OPTIONS,
            headers: {
                Accept: "application/octet-stream"
            },
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        const stream = request(options).pipe(fs.createWriteStream(targetPath))
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve())
            stream.on("error", e => reject(e))
        })
    }

    async getConfigElementXml(id: string): Promise<string> {
        const uri = `https://${this.hostname}:${this.port}/vco/api/configurations/${id}/`
        const options = {
            ...DEFAULT_REQUEST_OPTIONS,
            headers: {
                Accept: "application/vcoobject+xml"
            },
            json: false,
            method: "GET",
            uri,
            auth: { ...(await this.getAuth()) },
            resolveWithFullResponse: false
        }

        return await request(options)
    }
}

const DEFAULT_REQUEST_OPTIONS = {
    headers: {
        Accept: "application/json"
    },
    json: true,
    simple: true, // reject non-2xx
    resolveWithFullResponse: true,
    rejectUnauthorized: false
}
