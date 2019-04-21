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
            (editor, edit) => this.execute(context, clientWindow, editor, edit)
        )

        context.subscriptions.push(disposable)
    }

    abstract get commandId(): string

    abstract execute(
        context: vscode.ExtensionContext,
        clientWindow: ClientWindow,
        editor: vscode.TextEditor,
        edit: vscode.TextEditorEdit
    ): Promise<void> | void
}
