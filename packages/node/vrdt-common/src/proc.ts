/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as cp from "child_process"

import Logger from "./logger"

export interface CmdResult {
    message?: string
    code: number
    stdout?: string
    stderr?: string
}
export function spawn(command: string, args: readonly string[], options: cp.SpawnOptions): cp.ChildProcess {
    return cp.spawn(command, args, options)
}

/**
 * @deprecated Use {@link execFile} instead. This function is vulnerable to command injection attacks
 * because it constructs and executes shell commands from concatenated strings. If any of the input
 * contains special shell characters or user-controlled data, it can lead to arbitrary command execution.
 *
 * @see {@link execFile} - Secure alternative that executes commands without spawning a shell,
 * preventing shell interpretation of special characters in arguments.
 *
 * @see https://cwe.mitre.org/data/definitions/78.html - CWE-78: OS Command Injection
 * @see https://owasp.org/www-community/attacks/Command_Injection - OWASP Command Injection
 */
export function exec(command: string, options: cp.ExecOptions, logger: Logger): Promise<CmdResult> {
    logger.debug(`Executing command "${command}" with options`, options)
    return new Promise<CmdResult>((resolve, reject) => {
        cp.exec(command, options, (err: cp.ExecException, stdout, stderr) => {
            logger.debug(stdout)
            if (err) {
                const message = `Command '${err.cmd}' exited with code ${err.code}`
                logger.error(message, stderr)
                reject({
                    code: err.code,
                    message,
                    stdout,
                    stderr
                })
            }

            resolve({ code: 0, stdout, stderr })
        })
    })
}

export function execFile(
    file: string,
    args: string[],
    options: cp.ExecFileOptions,
    logger: Logger
): Promise<CmdResult> {
    logger.debug(`Executing file "${file}" with args`, args)
    return new Promise<CmdResult>((resolve, reject) => {
        cp.execFile(file, args, options, (err: cp.ExecException, stdout, stderr) => {
            logger.debug(stdout)
            if (err) {
                const message = `Command '${err.cmd}' exited with code ${err.code}`
                logger.error(message, stderr)
                reject({
                    code: err.code,
                    message,
                    stdout,
                    stderr
                })
            }

            resolve({ code: 0, stdout, stderr })
        })
    })
}
