/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import createMockInstance from "jest-create-mock-instance"
import { VroElementPickInfo } from "vrealize-common"
import { remote } from "vro-language-server"
import * as vscode from "vscode"
import * as client from "vscode-languageclient"

import { ShowActions, ShowConfigurations, TriggerCollection } from "../client/command"
import { ClientWindow } from "../client/ui"

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
        let fakeModules: VroElementPickInfo[]
        let fakeActions: VroElementPickInfo[]

        beforeEach(() => {
            testActionUri = vscode.Uri.parse("o11n://action/test.module/TestAction.js#test.module/TestAction")
            fakeModules = [
                {
                    kind: "module", name: "test.module",
                    description: "1 actions", label: "test.module"
                }
            ]

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
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(true)

            languageClient.sendRequest.mockResolvedValue(fakeActions)
            quickPickStub.mockResolvedValue(fakeActions[0])
            openDocStub.mockResolvedValue("content")
            showDocStub.mockResolvedValue()

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeActions)
            expect(openDocStub).toHaveBeenCalledWith(testActionUri)
            expect(showDocStub).toHaveBeenCalledWith("content")
        })

        it("should not try to open an action, if no action selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(true)

            languageClient.sendRequest.mockResolvedValue(fakeActions)
            quickPickStub.mockResolvedValue(undefined)
            openDocStub.mockResolvedValue(undefined)
            showDocStub.mockResolvedValue(undefined)

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeActions)
            expect(openDocStub).not.toHaveBeenCalledWith()
            expect(showDocStub).not.toHaveBeenCalledWith()
        })

        it("should be able to provide separate selections for module and action", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)

            languageClient.sendRequest.onFirstCall().mockResolvedValue(fakeModules)
            languageClient.sendRequest.onSecondCall().mockResolvedValue(fakeActions)

            quickPickStub.onFirstCall().mockResolvedValue("test.module")
            quickPickStub.onSecondCall().mockResolvedValue(fakeActions[0])
            openDocStub.mockResolvedValue("content")
            showDocStub.mockResolvedValue(undefined)

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeModules)
            expect(quickPickStub).toHaveBeenCalledWith(fakeActions)
            expect(openDocStub).toHaveBeenCalledWith(testActionUri)
            expect(showDocStub).toHaveBeenCalledWith("content")
        })

        it("should not try to open an action, if no module selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)
            languageClient.sendRequest.onFirstCall().mockResolvedValue(fakeModules)
            quickPickStub.mockResolvedValue()

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenNthCalledWith(1)
            expect(openDocStub).not.toHaveBeenCalledWith()
            expect(showDocStub).not.toHaveBeenCalledWith()
        })
    })

    describe("Show Configurations", () => {
        let testConfigUri: vscode.Uri
        let fakeCategories: VroElementPickInfo[]
        let fakeConfigurations: VroElementPickInfo[]

        beforeEach(() => {
            testConfigUri = vscode.Uri.parse(
                "o11n://configuration/PSCoE/Library/vRA/Extensibility.xml#90ee9bdb-ba13-4bf5-92ee-2ef9393f12de")

            fakeCategories = [
                {
                    kind: "category", name: "PSCoE/Library/vRA",
                    description: "1 configuration elements", label: "PSCoE/Library/vRA"
                }
            ]

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
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(true)

            languageClient.sendRequest.mockResolvedValue(fakeConfigurations)
            quickPickStub.mockResolvedValue(fakeConfigurations[0])
            openDocStub.mockResolvedValue("content")
            showDocStub.mockResolvedValue()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeConfigurations)
            expect(openDocStub).toHaveBeenCalledWith(testConfigUri)
            expect(showDocStub).toHaveBeenCalledWith("content")
        })

        it("should not try to open a configuration element, if no selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(true)

            languageClient.sendRequest.mockResolvedValue(fakeConfigurations)
            quickPickStub.mockResolvedValue(undefined)
            openDocStub.mockResolvedValue()
            showDocStub.mockResolvedValue()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeConfigurations)
            expect(openDocStub).not.toHaveBeenCalledWith()
            expect(showDocStub).not.toHaveBeenCalledWith()
        })

        it("should be able to provide separate selections for category and configuration element", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)

            languageClient.sendRequest.onFirstCall().mockResolvedValue(fakeCategories)
            languageClient.sendRequest.onSecondCall().mockResolvedValue(fakeConfigurations)

            quickPickStub.onFirstCall().mockResolvedValue("PSCoE/Library/vRA")
            quickPickStub.onSecondCall().mockResolvedValue(fakeConfigurations[0])
            openDocStub.mockResolvedValue("content")
            showDocStub.mockResolvedValue()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).toHaveBeenCalledWith(fakeCategories)
            expect(quickPickStub).toHaveBeenCalledWith(fakeConfigurations)
            expect(openDocStub).toHaveBeenCalledWith(testConfigUri)
            expect(showDocStub).toHaveBeenCalledWith("content")
        })

        it("should not try to open a configuration element, if no category selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)
            languageClient.sendRequest.onFirstCall().mockResolvedValue(fakeCategories)
            quickPickStub.mockResolvedValue()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledOnce.calledWith()
            expect(openDocStub).not.toHaveBeenCalledWith()
            expect(showDocStub).not.toHaveBeenCalledWith()
        })
    })

    describe("Trigger Collection", () => {
        let clientWindow: ClientWindow
        let triggerCollectionStub: sinon.SinonStub
        let collectionStatusStub: sinon.SinonStub
        let collectionStartSpy: sinon.SinonSpy
        let collectionSuccessSpy: sinon.SinonSpy
        let collectionErrorSpy: sinon.SinonSpy
        let progressSpy: sinon.SinonSpy

        beforeEach(() => {
            clientWindow = new ClientWindow("fake-vro")

            triggerCollectionStub = languageClient.sendRequest.withArgs(remote.server.triggerVroCollection)
            collectionStatusStub = languageClient.sendRequest.withArgs(remote.server.giveVroCollectionStatus)

            collectionStartSpy = sinon.spy(clientWindow, "onCollectionStart")
            collectionSuccessSpy = sinon.spy(clientWindow, "onCollectionSuccess")
            collectionErrorSpy = sinon.spy(clientWindow, "onCollectionError")
        })

        afterEach(() => {
            collectionStartSpy.restore()
            collectionSuccessSpy.restore()
            collectionErrorSpy.restore()
            progressSpy.restore()
        })

        it("should not show errors if the collection succeeded", done => {
            triggerCollectionStub.mockResolvedValue()
            collectionStatusStub.mockResolvedValue({
                finished: true
            })

            progressSpy = sinon.stub(vscode.window, "withProgress").callsFake(async (options, task) => {
                await task()

                expect(collectionStartSpy).to.have.been.calledOnce.calledWith()
                expect(collectionSuccessSpy).to.have.been.calledOnce.calledWith()
                expect(collectionErrorSpy).not.toHaveBeenCalledWith()

                done()
            })

            new TriggerCollection(languageServices as any).execute(extensionContext, clientWindow)
        })

        it("should show error if the collection failed", done => {
            triggerCollectionStub.mockResolvedValue()
            collectionStatusStub.mockResolvedValue({
                error: "some error",
                data: {
                    hintsPluginBuild: 15
                },
                finished: true
            })

            progressSpy = sinon.stub(vscode.window, "withProgress").callsFake(async (options, task) => {
                await task()

                expect(collectionStartSpy).toHaveBeenNthCalledWith(1)
                expect(collectionSuccessSpy).not.toHaveBeenCalledWith()
                expect(collectionErrorSpy).toHaveBeenNthCalledWith(1, "some error")

                done()
            })

            new TriggerCollection(languageServices as any).execute(extensionContext, clientWindow)
        })
    })
})
