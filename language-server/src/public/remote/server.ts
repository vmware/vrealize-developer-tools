/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { VroElementPickInfo } from "vrealize-common"
import { RequestType, RequestType0 } from "vscode-jsonrpc"

import { CollectionStatus } from "../../server/request/collection"

export const triggerWorkspaceCollection =
    new RequestType0<void, void, void>("vrdev.server.collect.workspace")

export const triggerVroCollection =
    new RequestType<boolean, void, void, void>("vrdev.server.collect.vro")

export const giveVroCollectionStatus =
    new RequestType0<CollectionStatus, void, void>("vrdev.server.collect.vro.status")

export const giveAllActions =
    new RequestType0<VroElementPickInfo[], void, void>("vrdev.server.giveAllActions")

export const giveActionModules =
    new RequestType0<VroElementPickInfo[], void, void>("vrdev.server.giveActionModules")

export const giveActionsForModule =
    new RequestType<string, VroElementPickInfo[], void, void>("vrdev.server.giveActionsForModule")

export const giveAllConfigElements =
    new RequestType0<VroElementPickInfo[], void, void>("vrdev.server.giveAllConfigElements")

export const giveConfigCategories =
    new RequestType0<VroElementPickInfo[], void, void>("vrdev.server.giveConfigCategories")

export const giveConfigsForCategory =
    new RequestType<string, VroElementPickInfo[], void, void>("vrdev.server.giveConfigsForCategory")

export const giveEntitySource =
    new RequestType<string, string, void, void>("vrdev.server.giveEntitySource")
