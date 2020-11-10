/*!
 * Copyright 2018-2019 VMware, Inc.
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
