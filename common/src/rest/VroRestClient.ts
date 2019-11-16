/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as http from "http"

import * as fs from "fs-extra"
import * as request from "request-promise-native"

import { ApiCategoryType } from "../types"
import { BaseConfiguration, BaseEnvironment } from "../platform"
import { Auth, BasicAuth, VraSsoAuth } from "./auth"
import {
    ApiElement,
    ContentChildrenResponse,
    ContentLinksResponse,
    InventoryElement,
    LogMessage,
    Version,
    WorkflowLogsResponse,
    WorkflowParam,
    WorkflowState
} from "./api"

import { Logger, MavenCliProxy, promise, sleep } from ".."

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

    private async send<T = any>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        route: string,
        options?: Partial<request.OptionsWithUrl>
    ): Promise<T> {
        const url = route.indexOf("://") > 0 ? route : `https://${this.hostname}:${this.port}/vco/api/${route}`
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

    async getWorkflowLogs(
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

        return packages.sort()
    }

    async getActions(): Promise<{ fqn: string; id: string; version: string }[]> {
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

        return actions.sort((x, y) => x.fqn.localeCompare(y.fqn))
    }

    async getWorkflows(): Promise<{ name: string; id: string; version: string }[]> {
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

        return workflows.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getConfigurations(): Promise<{ name: string; id: string; version: string }[]> {
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

        return configs.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getResources(): Promise<{ name: string; id: string }[]> {
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

        return resources.sort((x, y) => x.name.localeCompare(y.name))
    }

    async getRootCategories(categoryType: ApiCategoryType): Promise<ApiElement[]> {
        const responseJson: ContentLinksResponse = await this.send(
            "GET",
            `categories?isRoot=true&categoryType=${categoryType}`
        )
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

        return children.sort((x, y) => x.name.localeCompare(y.name))
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
        const responseJson: ContentChildrenResponse = await this.send("GET", href || "inventory")
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
}
