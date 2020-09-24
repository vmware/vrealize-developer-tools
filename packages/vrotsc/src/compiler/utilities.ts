/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    export function noop(_?: {} | null | undefined): void { } // eslint-disable-line

    export function returnUndefined(): undefined { return undefined; }

    export function notImplemented(): never {
        throw new Error("Not implemented");
    }

    export function copyArray<T>(dest: T[], src: readonly T[], start?: number, end?: number): T[] {
        start = start === undefined ? 0 : start;
        end = end === undefined ? src.length : end;
        for (let i = start; i < end && i < src.length; i++) {
            if (src[i] !== undefined) {
                dest.push(src[i]);
            }
        }
        return dest;
    }

    export function generateElementId(fileType: FileType, path: string): string {
        return system.uuid(path.replace(/\\/g, "/"), getIdHashForFile());

        function getIdHashForFile(): string {
            switch (fileType) {
                case vrotsc.FileType.Workflow:
                    return "0d79ca9f-3e6c-4194-b73c-35eb5ba9cb80";
                case vrotsc.FileType.PolicyTemplate:
                    return "42bf5b9b-20f3-428c-bdf4-d800a7cdc265";
                case vrotsc.FileType.ConfigurationTS:
                case vrotsc.FileType.ConfigurationYAML:
                    return "b93b589d-53ac-48e5-b9ca-59d83447d64c";
                case vrotsc.FileType.Resource:
                    return "89e14cd8-f955-4634-aadf-34306c862737";
                default:
                    throw new Error(`Unimplemented ID Generation type: ${fileType}`);
            }
        }
    }
}
