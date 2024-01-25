/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
export const ActionsPackProto = `syntax = "proto3";

package vmw.pscoe.hints;

message ActionsPack {
    uint32 version = 1;
    string uuid = 2;
    Metadata metadata = 3;
    repeated Module modules = 4;

    message Metadata {
        int64 timestamp = 1;
        string server_name = 2;
        string server_version = 3;
        string hinting_version = 4;
    }
}

message Module {
    string name = 1;
    repeated Action actions = 2;
}

message Action {
    string name = 1;
    string version = 2;
    string description = 3;
    string returnType = 4;
    repeated Parameter parameters = 5;

    message Parameter {
        string name = 1;
        string type = 2;
        string description = 3;
    }
}`

export const Timeout = {
    ONE_SECOND: 1000
}

export enum CompletionPrefixKind {
    UNKNOWN = "Unknown",
    CLASS_IMPORT = "Class Import",
    CLASS_REFERENCE = "Class Reference",
    STATIC_MEMBER_REFERENCE = "Static Member Reference",
    NEW_INSTANCE = "New Instance",
    MODULE_IMPORT = "Module Import"
}
