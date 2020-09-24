/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { AutoWire } from "vrealize-common"
import * as server from "vscode-languageserver"

@AutoWire
export class ConnectionLocator {
    /**
     * Note that you can register only one handler per type of notification.
     * Any subsequent handler registrations for the same notification type
     * will silently overwrite the previous one.
     *
     * For examples how to cover multiple handlers per type,
     * see `WorkspaceWatcher` and `ConfigurationWatcher`.
     *
     * @see https://github.com/Microsoft/vscode-languageserver-node/issues/299
     */
    readonly connection: server.IConnection = server.createConnection()
}
