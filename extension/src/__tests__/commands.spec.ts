/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import createMockInstance from "jest-create-mock-instance"
import { VroElementPickInfo } from "vrealize-common"
import * as vscode from "vscode"
import * as client from "vscode-languageclient"

import { ShowActions, ShowConfigurations } from "../client/command"

describe("Commands", () => {
    let languageClient: jest.Mocked<client.LanguageClient>
    let extensionContext: vscode.ExtensionContext
    let quickPickStub: jest.SpyInstance
    let openDocStub: jest.SpyInstance
    let showDocStub: jest.SpyInstance
    let configStub: jest.SpyInstance

    const languageServices = {
        get client() {
            return languageClient
        }
    }

    const mockedConfig = {
        get: jest.fn()
    }

    beforeEach(() => {
        languageClient = createMockInstance<client.LanguageClient>(client.LanguageClient)
        extensionContext = {} as vscode.ExtensionContext
        quickPickStub = jest.spyOn(vscode.window, "showQuickPick")
        openDocStub = jest.spyOn(vscode.workspace, "openTextDocument")
        showDocStub = jest.spyOn(vscode.window, "showTextDocument")

        configStub = jest.spyOn(vscode.workspace, "getConfiguration")
        configStub.mockImplementation((...args) => {
            if (args[0] === "vrdev") {
                return mockedConfig
            } else {
                return undefined
            }
        })
    })

    afterEach(() => {
        languageClient.sendRequest.mockRestore()
        quickPickStub.mockRestore()
        openDocStub.mockRestore()
        showDocStub.mockRestore()
        configStub.mockRestore()
        mockedConfig.get.mockReset()
    })

    describe("Show Actions", () => {
        let testActionUri: vscode.Uri
        let fakeActions: VroElementPickInfo[]

        beforeEach(() => {
            testActionUri = vscode.Uri.parse("o11n://action/test.module/TestAction.js#test.module/TestAction")

            fakeActions = [
                {
                    kind: "action", name: "TestAction",
                    path: "test.module", description: "v1.0.0",
                    label: "test.module/TestAction",
                    id: "test.module/TestAction"
                }
            ]
        })

        it("should open the selected action", async () => {
            mockedConfig.get.mockImplementation((...args) => {
                return args[0] === "commandPalette.useFullyQualifiedNames"
            })

            languageClient.sendRequest.mockResolvedValue(fakeActions)
            quickPickStub.mockResolvedValue(fakeActions[0])
            openDocStub.mockResolvedValue("content")
            showDocStub.mockResolvedValue(undefined)

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeActions)
            expect(openDocStub).toHaveBeenCalledWith(testActionUri)
            expect(showDocStub).toHaveBeenCalledWith("content")
        })

        it("should not try to open an action, if no action selection was made", async () => {
            mockedConfig.get.mockImplementation((...args) => {
                return args[0] === "commandPalette.useFullyQualifiedNames"
            })

            languageClient.sendRequest.mockResolvedValue(fakeActions)
            quickPickStub.mockResolvedValue(undefined)
            openDocStub.mockResolvedValue(undefined)
            showDocStub.mockResolvedValue(undefined)

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeActions)
            expect(openDocStub).not.toHaveBeenCalledWith()
            expect(showDocStub).not.toHaveBeenCalledWith()
        })
    })

    describe("Show Configurations", () => {
        let testConfigUri: vscode.Uri
        let fakeConfigurations: VroElementPickInfo[]

        beforeEach(() => {
            testConfigUri = vscode.Uri.parse(
                "o11n://configuration/PSCoE/Library/vRA/Extensibility.xml#90ee9bdb-ba13-4bf5-92ee-2ef9393f12de")

            fakeConfigurations = [
                {
                    kind: "action", name: "Extensibility",
                    path: "PSCoE/Library/vRA", description: "v1.0.0",
                    label: "PSCoE/Library/vRA/Extensibility",
                    id: "90ee9bdb-ba13-4bf5-92ee-2ef9393f12de"
                }
            ]
        })

        it("should open the selected configuration element", async () => {
            mockedConfig.get.mockImplementation((...args) => {
                return args[0] === "commandPalette.useFullyQualifiedNames"
            })

            languageClient.sendRequest.mockResolvedValue(fakeConfigurations)
            quickPickStub.mockResolvedValue(fakeConfigurations[0])
            openDocStub.mockResolvedValue("content")
            showDocStub.mockResolvedValue(undefined)

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeConfigurations)
            expect(openDocStub).toHaveBeenCalledWith(testConfigUri)
            expect(showDocStub).toHaveBeenCalledWith("content")
        })

        it("should not try to open a configuration element, if no selection was made", async () => {
            mockedConfig.get.mockImplementation((...args) => {
                return args[0] === "commandPalette.useFullyQualifiedNames"
            })

            languageClient.sendRequest.mockResolvedValue(fakeConfigurations)
            quickPickStub.mockResolvedValue(undefined)
            openDocStub.mockResolvedValue(undefined)
            showDocStub.mockResolvedValue(undefined)

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeConfigurations)
            expect(openDocStub).not.toHaveBeenCalledWith()
            expect(showDocStub).not.toHaveBeenCalledWith()
        })
    })
})
