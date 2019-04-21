/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { LogChannel, default as Logger } from "../logger"

describe("utility", () => {
    describe("logger", () => {
        // fixate the date
        const constantDate = new Date("2019-03-31T12:13:14.000Z")
        Date = jest.fn(() => constantDate) as any

        const mockedDebug = jest.fn()
        const mockedInfo = jest.fn()
        const mockedWarn = jest.fn()
        const mockedError = jest.fn()

        const logger: Logger = Logger.get("TestLog")
        const logChannel: LogChannel = {
            debug: mockedDebug,
            info: mockedInfo,
            warn: mockedWarn,
            error: mockedError
        }

        // setup initially
        Logger.setup(logChannel, "debug")

        afterEach(() => {
            Logger.setup(undefined, "debug")

            mockedDebug.mockClear()
            mockedInfo.mockClear()
            mockedWarn.mockClear()
            mockedError.mockClear()
        })

        describe("level: off", () => {
            it.each(["debug", "info", "warn", "error"])(".%s() can't log messages", level => {
                Logger.setup(undefined, "off")
                logger[level]("some message")
                expect(logChannel[level]).not.toHaveBeenCalled()
            })
        })

        describe("level: debug", () => {
            it.each(["debug", "info", "warn", "error"])(".%s() can log messages", level => {
                Logger.setup(undefined, "debug")
                logger[level]("some message")
                expect(logChannel[level]).toHaveBeenCalled()
            })
        })

        describe("level: info", () => {
            it(".debug() can't log messages", () => {
                Logger.setup(undefined, "info")
                logger.debug("some message")
                expect(logChannel.debug).not.toHaveBeenCalled()
            })

            it.each(["info", "warn", "error"])(".%s() can log messages", level => {
                Logger.setup(undefined, "info")
                logger[level]("some message")
                expect(logChannel[level]).toHaveBeenCalled()
            })
        })

        describe("format", () => {
            it.each(["debug", "info", "warn", "error"])(".%s() should format logged messages", level => {
                logger[level]("message:", "data")
                let formattedMessage = `[2019-03-31T12:13:14.000Z ${level.toUpperCase()} - TestLog] message: data`
                expect(logChannel[level]).toHaveBeenCalledWith(formattedMessage)

                logger[level]("message:", { data: 1 })
                formattedMessage = `[2019-03-31T12:13:14.000Z ${level.toUpperCase()} - TestLog] message: {\"data\":1}`
                expect(logChannel[level]).toHaveBeenCalledWith(formattedMessage)

                const error = new Error("error")
                error.stack = "stack trace"
                logger[level]("message:", error)
                formattedMessage = `[2019-03-31T12:13:14.000Z ${level.toUpperCase()} - TestLog] message: stack trace`
                expect(logChannel[level]).toHaveBeenCalledWith(formattedMessage)

                error.stack = undefined
                logger[level]("message:", error)
                formattedMessage = `[2019-03-31T12:13:14.000Z ${level.toUpperCase()} - TestLog] message: error`
                expect(logChannel[level]).toHaveBeenCalledWith(formattedMessage)
            })
        })
    })
})
