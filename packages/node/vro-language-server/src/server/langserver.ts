/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { di, LogChannel, Logger } from "@vmware/vrdt-common"
import { IConnection } from "vscode-languageserver"

import * as core from "./core"
import * as document from "./document"
import * as feature from "./feature"
import * as maven from "./maven"
import * as request from "./request"

function registerModule(mod: any) {
    for (const i in mod) {
        if (mod.hasOwnProperty(i)) {
            try {
                logger.debug(`Registering class ${i}`)
                container.get(mod[i])
            } catch (e) {
                logger.debug(`Caught error: ${e} for class: ${i}`)
                if (e.message.indexOf("__autowire") < 0) {
                    logger.debug(`Visited classes: ${e.visited}`)
                    logger.error(e.stack)
                    throw e
                }
            }
        }
    }
}

function getLoggingChannel(connection: IConnection): LogChannel {
    return {
        debug(message: string) {
            connection.console.log(message)
        },

        info(message: string) {
            connection.console.info(message)
        },

        warn(message: string) {
            connection.console.warn(message)
        },

        error(message: string) {
            connection.console.error(message)
        }
    }
}

const container = new di.Container()
const locator: core.ConnectionLocator = container.get(core.ConnectionLocator)

Logger.setup(getLoggingChannel(locator.connection))

const logger = Logger.get("langserver")
logger.info("\n\n=== Booting the vRO language server ===\n")

registerModule(core)
registerModule(maven)
registerModule(feature)
registerModule(request)
registerModule(document)

locator.connection.listen()
logger.info("Listening for requests")
