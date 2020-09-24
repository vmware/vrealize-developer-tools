/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "vrealize-common"
import * as vscode from "vscode"

import { Registrable } from "../Registrable"

export abstract class Command<T> implements Registrable {
    register(context: vscode.ExtensionContext): void {
        Logger.get("Command").debug(`Registering command '${this.commandId}'`)

        const disposable: vscode.Disposable = vscode.commands.registerCommand(this.commandId, (...args: any[]) =>
            this.execute(context, ...args)
        )

        context.subscriptions.push(disposable)
    }

    abstract get commandId(): string

    abstract execute(context: vscode.ExtensionContext, ...args: any[]): Promise<T> | T
}
