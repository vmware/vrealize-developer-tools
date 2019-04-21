/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as fs from "fs"
import * as http from "http"

import * as request from "request"
import * as rp from "request-promise-native"

export function requestPromiseStream(options: rp.OptionsWithUri): Promise<http.IncomingMessage> {
    return new Promise((resolve, reject) => {
        const req = request(options)
        req.on("error", reject)
        req.on("response", response => {
            // pause the stream so that it isn't flowing during the async promise hop
            response.pause()
            resolve(response)
        })
    })
}

class StreamError extends Error {
    readonly source: fs.WriteStream
    readonly originalError: Error

    constructor(error: Error, source: fs.WriteStream) {
        const { message } = error || { message: "" }
        super(message)
        this.source = source
        this.originalError = error
    }
}

export function streamPromise(stream: fs.WriteStream) {
    function on(event: string) {
        return new Promise((resolve, reject) => {
            if (event === "error") {
                stream.on(event, err => reject(new StreamError(err, stream)))
            } else {
                stream.on(event, () => resolve(stream))
            }
        })
    }

    return Promise.race(["error", "end", "close", "finish"].map(on))
}

export function streamPromisePipe(...streams: fs.WriteStream[]) {
    const allStreams = streams.reduce((current, next) => current.concat(next), [] as fs.WriteStream[])

    allStreams.reduce((current, next) => current.pipe(next))
    return Promise.all(allStreams.map(streamPromise))
}

export function timeout<T>(ms: number, promise: Promise<T>): Promise<T> {
    const timeout = new Promise<T>((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id)
            reject(`Operation timed out in ${ms}ms.`)
        }, ms)
    })

    return Promise.race([promise, timeout])
}
