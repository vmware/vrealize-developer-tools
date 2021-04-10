/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "@vmware/vrdt-common"
import * as vscode from "vscode"

import { Registrable } from "../Registrable"

export abstract class EditorCommand implements Registrable {
    register(context: vscode.ExtensionContext): void {
        Logger.get("EditorCommand").debug(`Registering editor command '${this.commandId}'`)

        const disposable: vscode.Disposable = vscode.commands.registerTextEditorCommand(
            this.commandId,
            (editor, edit, ...args: any[]) => this.execute(context, editor, edit, ...args)
        )

        context.subscriptions.push(disposable)
    }

    abstract get commandId(): string

    abstract execute(
        context: vscode.ExtensionContext,
        editor: vscode.TextEditor,
        edit: vscode.TextEditorEdit,
        ...args: any[]
    ): Promise<void> | void
}
