/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as http from "http"

import * as fs from "fs-extra"
import * as request from "request-promise-native"

import { Logger, MavenCliProxy, promise, sleep } from ".."

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
            origin: string
            severity: string
            "time-stamp": string
            "short-description": string
            "long-description": string
        }
    }[]
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
            uri: `https://${this.hostname}:${this.port}/vco/api/workflows/${workflowId}/executions/${executionId}/syslogs`,
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
