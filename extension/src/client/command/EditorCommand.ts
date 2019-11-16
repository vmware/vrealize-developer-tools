/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "vrealize-common"
import * as vscode from "vscode"

import { ClientWindow } from "../ui"
import { Registrable } from "../Registrable"

export abstract class EditorCommand implements Registrable {
    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void {
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
