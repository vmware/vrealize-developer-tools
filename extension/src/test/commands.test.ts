/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

require("module-alias/register")

import * as chai from "chai"
import { VroElementPickInfo } from "vrealize-common"
import { remote } from "vro-language-server"
import * as sinon from "sinon"
import * as sinonChai from "sinon-chai"
import * as vscode from "vscode"
import * as client from "vscode-languageclient"

import { ShowActions, ShowConfigurations, TriggerCollection } from "../client/command"
import { ClientWindow } from "../client/ui"

const expect = chai.expect
chai.use(sinonChai)

describe("Commands", () => {
    let languageClient: sinon.SinonStubbedInstance<client.LanguageClient>
    let extensionContext: vscode.ExtensionContext
    let quickPickStub: sinon.SinonStub
    let openDocStub: sinon.SinonStub
    let showDocStub: sinon.SinonStub
    let configStub: sinon.SinonStub

    const languageServices = {
        get client() {
            return languageClient
        }
    }

    const mockedConfig = {
        get: sinon.stub()
    }

    beforeEach("prepare vscode stubs", () => {
        languageClient = sinon.createStubInstance<client.LanguageClient>(client.LanguageClient)
        extensionContext = {} as vscode.ExtensionContext
        quickPickStub = sinon.stub(vscode.window, "showQuickPick")
        openDocStub = sinon.stub(vscode.workspace, "openTextDocument")
        showDocStub = sinon.stub(vscode.window, "showTextDocument")

        configStub = sinon.stub(vscode.workspace, "getConfiguration")
        configStub.withArgs("vrdev").returns(mockedConfig)
    })

    afterEach("reset vscode stubs", () => {
        languageClient.sendRequest.restore()
        quickPickStub.restore()
        openDocStub.restore()
        showDocStub.restore()
        configStub.restore()
        mockedConfig.get.reset()
    })

    describe("Show Actions", () => {
        let testActionUri: vscode.Uri
        let fakeModules: VroElementPickInfo[]
        let fakeActions: VroElementPickInfo[]

        beforeEach("prepare fake modules and actions", () => {
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

            languageClient.sendRequest.resolves(fakeActions)
            quickPickStub.resolves(fakeActions[0])
            openDocStub.resolves("content")
            showDocStub.resolves()

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledWith(fakeActions)
            expect(openDocStub).to.have.been.calledWith(testActionUri)
            expect(showDocStub).to.have.been.calledWith("content")
        })

        it("should not try to open an action, if no action selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(true)

            languageClient.sendRequest.resolves(fakeActions)
            quickPickStub.resolves(undefined)
            openDocStub.resolves()
            showDocStub.resolves()

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledWith(fakeActions)
            expect(openDocStub).to.not.have.been.calledWith()
            expect(showDocStub).to.not.have.been.calledWith()
        })

        it("should be able to provide separate selections for module and action", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)

            languageClient.sendRequest.onFirstCall().resolves(fakeModules)
            languageClient.sendRequest.onSecondCall().resolves(fakeActions)

            quickPickStub.onFirstCall().resolves("test.module")
            quickPickStub.onSecondCall().resolves(fakeActions[0])
            openDocStub.resolves("content")
            showDocStub.resolves()

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledWith(fakeModules)
            expect(quickPickStub).to.have.been.calledWith(fakeActions)
            expect(openDocStub).to.have.been.calledWith(testActionUri)
            expect(showDocStub).to.have.been.calledWith("content")
        })

        it("should not try to open an action, if no module selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)
            languageClient.sendRequest.onFirstCall().resolves(fakeModules)
            quickPickStub.resolves()

            await new ShowActions(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledOnce.calledWith()
            expect(openDocStub).to.not.have.been.calledWith()
            expect(showDocStub).to.not.have.been.calledWith()
        })
    })

    describe("Show Configurations", () => {
        let testConfigUri: vscode.Uri
        let fakeCategories: VroElementPickInfo[]
        let fakeConfigurations: VroElementPickInfo[]

        beforeEach("prepare fake categories and configurations", () => {
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

            languageClient.sendRequest.resolves(fakeConfigurations)
            quickPickStub.resolves(fakeConfigurations[0])
            openDocStub.resolves("content")
            showDocStub.resolves()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledWith(fakeConfigurations)
            expect(openDocStub).to.have.been.calledWith(testConfigUri)
            expect(showDocStub).to.have.been.calledWith("content")
        })

        it("should not try to open a configuration element, if no selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(true)

            languageClient.sendRequest.resolves(fakeConfigurations)
            quickPickStub.resolves(undefined)
            openDocStub.resolves()
            showDocStub.resolves()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledWith(fakeConfigurations)
            expect(openDocStub).to.not.have.been.calledWith()
            expect(showDocStub).to.not.have.been.calledWith()
        })

        it("should be able to provide separate selections for category and configuration element", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)

            languageClient.sendRequest.onFirstCall().resolves(fakeCategories)
            languageClient.sendRequest.onSecondCall().resolves(fakeConfigurations)

            quickPickStub.onFirstCall().resolves("PSCoE/Library/vRA")
            quickPickStub.onSecondCall().resolves(fakeConfigurations[0])
            openDocStub.resolves("content")
            showDocStub.resolves()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledWith(fakeCategories)
            expect(quickPickStub).to.have.been.calledWith(fakeConfigurations)
            expect(openDocStub).to.have.been.calledWith(testConfigUri)
            expect(showDocStub).to.have.been.calledWith("content")
        })

        it("should not try to open a configuration element, if no category selection was made", async () => {
            mockedConfig.get.withArgs("commandPalette.useFullyQualifiedNames").returns(false)
            languageClient.sendRequest.onFirstCall().resolves(fakeCategories)
            quickPickStub.resolves()

            await new ShowConfigurations(languageServices as any).execute(extensionContext)

            expect(quickPickStub).to.have.been.calledOnce.calledWith()
            expect(openDocStub).to.not.have.been.calledWith()
            expect(showDocStub).to.not.have.been.calledWith()
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

        beforeEach("prepare dependencies", () => {
            clientWindow = new ClientWindow("fake-vro")

            triggerCollectionStub = languageClient.sendRequest.withArgs(remote.server.triggerVroCollection)
            collectionStatusStub = languageClient.sendRequest.withArgs(remote.server.giveVroCollectionStatus)

            collectionStartSpy = sinon.spy(clientWindow, "onCollectionStart")
            collectionSuccessSpy = sinon.spy(clientWindow, "onCollectionSuccess")
            collectionErrorSpy = sinon.spy(clientWindow, "onCollectionError")
        })

        afterEach("reset stubs", () => {
            collectionStartSpy.restore()
            collectionSuccessSpy.restore()
            collectionErrorSpy.restore()
            progressSpy.restore()
        })

        it("should not show errors if the collection succeeded", done => {
            triggerCollectionStub.resolves()
            collectionStatusStub.resolves({
                finished: true
            })

            progressSpy = sinon.stub(vscode.window, "withProgress").callsFake(async (options, task) => {
                await task()

                expect(collectionStartSpy).to.have.been.calledOnce.calledWith()
                expect(collectionSuccessSpy).to.have.been.calledOnce.calledWith()
                expect(collectionErrorSpy).to.not.have.been.calledWith()

                done()
            })

            new TriggerCollection(languageServices as any).execute(extensionContext, clientWindow)
        })

        it("should show error if the collection failed", done => {
            triggerCollectionStub.resolves()
            collectionStatusStub.resolves({
                error: "some error",
                data: {
                    hintsPluginBuild: 15
                },
                finished: true
            })

            progressSpy = sinon.stub(vscode.window, "withProgress").callsFake(async (options, task) => {
                await task()

                expect(collectionStartSpy).to.have.been.calledOnce.calledWith()
                expect(collectionSuccessSpy).to.not.have.been.calledWith()
                expect(collectionErrorSpy).to.have.been.calledOnce.calledWith("some error")

                done()
            })

            new TriggerCollection(languageServices as any).execute(extensionContext, clientWindow)
        })
    })
})
