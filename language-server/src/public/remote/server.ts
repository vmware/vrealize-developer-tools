/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { RequestType, RequestType0 } from "vscode-jsonrpc"

import { CollectionStatus } from "../../server/request/collection"

export const triggerWorkspaceCollection = new RequestType0<void, void, void>("vrdev.server.collect.workspace")

export const triggerVroCollection = new RequestType<boolean, void, void, void>("vrdev.server.collect.vro")

export const giveVroCollectionStatus = new RequestType0<CollectionStatus, void, void>("vrdev.server.collect.vro.status")
