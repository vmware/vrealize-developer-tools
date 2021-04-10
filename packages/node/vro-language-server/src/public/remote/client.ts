/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { MavenProfilesMap } from "@vmware/vrdt-common"
import { NotificationType, RequestType } from "vscode-jsonrpc"
import { Location, TextDocumentIdentifier, TextDocumentPositionParams } from "vscode-languageclient"

import * as types from "../types"

export const givePrefix = new RequestType<TextDocumentPositionParams, null | string, void>("vrdev.client.givePrefix")

export const giveText = new RequestType<Location, string, void>("vrdev.client.giveText")

export const giveTextDocument = new RequestType<TextDocumentIdentifier, types.TextDocumentData, void>(
    "vrdev.client.giveTextDocument"
)

export const giveWordAtPosition = new RequestType<types.LocatedPosition, string, void>(
    "vrdev.client.giveWordAtPosition"
)

export const didChangeMavenProfiles = new NotificationType<MavenProfilesMap>("vrdev.client.didChangeMavenProfiles")
