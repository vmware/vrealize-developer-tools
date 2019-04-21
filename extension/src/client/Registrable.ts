/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"

import { ClientWindow } from "./ui"

export interface Registrable {
    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void
}
