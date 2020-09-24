/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"

export interface Registrable {
    register(context: vscode.ExtensionContext): void
}
