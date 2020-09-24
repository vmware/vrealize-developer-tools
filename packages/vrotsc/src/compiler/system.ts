/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    declare const require: any;
    declare const process: any;
    declare const __filename: string;
    const _os = require("os");
    const _path: typeof import("path") = require("path");

    const _fs: typeof import("fs-extra") = require("fs-extra");
    const _uuid: typeof import("uuid/v3") = require("uuid/v3");

    export interface System {
        readonly args: string[];
        readonly newLine: string;
        readonly pathSeparator: string;
        getExecutingFilePath(): string;
        getExecutingDirPath(): string;
        getCurrentDirectory(): string;
        getEnvironmentVariable(name: string): string;
        resolvePath(...pathSegments: string[]): string;
        relativePath(from: string, to: string): string;
        joinPath(...paths: string[]): string;
        normalizePath(path: string): string;
        dirname(path: string): string;
        basename(path: string, ext?: string): string;
        extname(fileName: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        readFile(path: string): Buffer;
        deleteFile(path: string): void;
        getFiles(path: string, recursive?: boolean): string[];
        getDirectories(path: string): string[];
        changeFileExt(name: string, newExt: string, currentExtFilter?: string[]): string;
        writeFile(path: string, data: string | Buffer): void;
        ensureDir(path: string): void;
        emptyDir(path: string): void;
        exit(exitCode?: number): void;
        uuid(name: string, namespace: string): string;
    }

    export const system: System = {
        args: process.argv.slice(2),
        newLine: _os.EOL,
        pathSeparator: _path.sep,
        getExecutingFilePath() {
            return toUnixPath(__filename);
        },
        getExecutingDirPath() {
            return toUnixPath(__dirname);
        },
        getCurrentDirectory() {
            return toUnixPath(process.cwd());
        },
        getEnvironmentVariable(name: string) {
            return process.env[name] || "";
        },
        resolvePath(...pathSegments: string[]): string {
            return toUnixPath(_path.resolve(...pathSegments));
        },
        relativePath(from: string, to: string): string {
            return toUnixPath(_path.relative(from, to));
        },
        joinPath(...paths: string[]): string {
            return toUnixPath(_path.join(...paths));
        },
        normalizePath(path: string): string {
            return toUnixPath(_path.normalize(path));
        },
        dirname(path: string): string {
            return toUnixPath(_path.dirname(path));
        },
        basename(path: string, ext?: string): string {
            return toUnixPath(_path.basename(path, ext));
        },
        extname(fileName: string): string {
            return toUnixPath(_path.extname(fileName));
        },
        fileExists(path: string): boolean {
            try {
                return _fs.statSync(path).isFile();
            }
            catch (e) {
                return false;
            }
        },
        directoryExists(path: string): boolean {
            try {
                return _fs.statSync(path).isDirectory();
            }
            catch (e) {
                return false;
            }
        },
        readFile(path: string): Buffer {
            return _fs.readFileSync(path);
        },
        deleteFile(path: string): void {
            _fs.removeSync(path);
        },
        getFiles(path: string, recursive?: boolean): string[] {
            let files = _fs.readdirSync(path, { withFileTypes: true })
                .filter(ent => !ent.isDirectory())
                .filter(ent => ent.name[0] !== ".")
                .map(ent => system.joinPath(path, ent.name));

            if (recursive) {
                system.getDirectories(path).forEach(dirName => {
                    files = files.concat(system.getFiles(system.joinPath(path, dirName), true));
                });
            }
            return files;
        },
        getDirectories(path: string): string[] {
            return _fs.readdirSync(path, { withFileTypes: true })
                .filter(ent => ent.isDirectory())
                .filter(ent => ent.name[0] !== ".")
                .map(ent => ent.name);
        },
        changeFileExt(name: string, newExt: string, currentExtFilter?: string[]): string {
            if (currentExtFilter && currentExtFilter.length) {
                const currentExt = currentExtFilter.find(ext => name.toLowerCase().endsWith(ext.toLowerCase()));
                if (currentExt) {
                    name = name.substring(0, name.length - currentExt.length);
                }
            }
            else {
                const currentExt = _path.extname(name);
                if (currentExt) {
                    name = name.substring(0, name.length - currentExt.length);
                }
            }
            name += newExt;
            return name;
        },
        writeFile(path: string, data: string | Buffer): void {
            _fs.writeFileSync(path, data);
        },
        ensureDir(path: string): void {
            _fs.ensureDirSync(path);
        },
        emptyDir(path: string): void {
            _fs.emptyDirSync(path);
        },
        exit(exitCode?: number): void {
            process.exit(exitCode);
        },
        uuid(name: string, namespace: string): string {
            return _uuid(name, namespace);
        },
    };

    function toUnixPath(path): string {
        return path.replace(/\\/g, "/");
    }
}