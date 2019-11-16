/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

require("module-alias/register")

import { LogChannel, Logger, LogLevel } from "vrealize-common"
import * as vscode from "vscode"

import { ModuleRegistry } from "./client"
import * as command from "./client/command"
import { Commands, OutputChannels } from "./client/constants"
import * as lang from "./client/lang"
import * as lint from "./client/lint"
import * as manager from "./client/manager"
import * as provider from "./client/provider"
import { ClientWindow } from "./client/ui"

const logger = Logger.get("extension")
let langServices: lang.LanguageServices

export async function activate(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration("vrdev")
    Logger.setup(getLoggingChannel(), config.get<LogLevel>("log"))

    logger.info("\n\n=== Activating vRealize Developer Tools ===\n")
    const window = new ClientWindow(config.get("maven.profile"), context)
    context.subscriptions.push(window)

    const registry = new ModuleRegistry(context, window)
    registry.registerModules(lang)

    // register and initialize the language services before the rest of the modules
    langServices = registry.get(lang.LanguageServices)
    await langServices.initialize()

    registry.registerModules(manager, command, lint, provider)

    if (window.verifyConfiguration(registry.get(manager.ConfigurationManager))) {
        vscode.commands.executeCommand(Commands.TriggerServerCollection, window)
    }
}

export async function deactivate() {
    await langServices.dispose()
    logger.info("\n\n=== Deactivated vRealize Developer Tools ===\n")
}

function getLoggingChannel(): LogChannel {
    const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel(OutputChannels.ExtensionLogs)

    return {
        debug(message: string) {
            outputChannel.appendLine(message)
        },

        info(message: string) {
            outputChannel.appendLine(message)
        },

        warn(message: string) {
            outputChannel.appendLine(message)
        },

        error(message: string) {
            outputChannel.appendLine(message)
        }
    }
}
