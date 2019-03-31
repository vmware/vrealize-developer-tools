/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { LogLevel } from "./types/settings"

export interface LogChannel {
    debug(message: string): void
    info(message: string): void
    warn(message: string): void
    error(message: string): void
}

export default class Logger {
    private static logLevel: LogLevel = "info"
    private static logChannel: LogChannel

    /**
     * Get a logger instance.
     *
     * @param className
     */
    public static get(className: string): Logger {
        return new Logger(className)
    }

    public static setup(channel?: LogChannel, logLevel?: LogLevel) {
        if (channel) {
            Logger.logChannel = channel
        }

        if (logLevel) {
            Logger.logLevel = logLevel
        }
    }

    private readonly format = (level: string, message: string, data?: any) => {
        return `[${new Date().toISOString()} ${level} - ${this.className}] ` +
            `${message} ${data ? this.metaToString(data) : ""}`
    }

    constructor(private className: string) {}

    public debug(message: string, data?: any): void {
        if (this.channel && Logger.logLevel === "debug") {
            this.channel.debug(this.format("DEBUG", message, data))
        }
    }

    public info(message: string, data?: any): void {
        if (this.channel) {
            this.channel.info(this.format("INFO", message, data))
        }
    }

    public warn(message: string, data ?: any): void {
        if (this.channel) {
            this.channel.warn(this.format("WARN", message, data))
        }
    }

    public error(message: string, data?: any): void {
        if (this.channel) {
            this.channel.error(this.format("ERROR", message, data))
        }
    }

    private get channel(): LogChannel|undefined {
        return Logger.logLevel !== "off" && Logger.logChannel ? Logger.logChannel : undefined
    }

    private metaToString(data: any): string {
        if (data instanceof Error) {
            if (typeof data.stack === "string") {
                return data.stack
            }

            return (data as Error).message
        }

        if (typeof data === "string") {
            return data
        }

        return data && Object.keys(data).length ? JSON.stringify(data) : ""
    }
}
