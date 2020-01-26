/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"
import * as moment from "moment"
import * as semver from "semver"
import * as tmp from "tmp"
import { AutoWire, Logger, MavenCliProxy, PomFile, sleep, VroRestClient, VrotscCliProxy } from "vrealize-common"
import * as vscode from "vscode"

import { Commands, OutputChannels } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../system"
import { ClientWindow } from "../ui"
import { Command } from "./Command"

const IIFE_WRAPPER_PATTERN = /\(function\s*\(\)\s*{([\s\S]*)}\);?/
const SCRIPT_ERROR_LINE_PATTERN = /\(eval\)#(\d+)\)\s+(.*)/
const RUN_SCRIPT_WORKFLOW_ID = "98568979-76ed-4a4a-854b-1e730e2ef4f1"

@AutoWire
export class RunAction extends Command {
    private readonly logger = Logger.get("RunAction")
    private readonly restClient: VroRestClient
    private readonly mavenProxy: MavenCliProxy
    private readonly vrotsc: VrotscCliProxy
    private readonly outputChannel = vscode.window.createOutputChannel(OutputChannels.RunActionLogs)
    private runtimeExceptionDecoration: vscode.TextEditorDecorationType

    private running = false

    get commandId(): string {
        return Commands.RunAction
    }

    constructor(private config: ConfigurationManager, private environment: EnvironmentManager) {
        super()
        this.restClient = new VroRestClient(config, environment)
        this.mavenProxy = new MavenCliProxy(environment, config.vrdev.maven, this.logger)
        this.vrotsc = new VrotscCliProxy(this.logger)
    }

    register(context: vscode.ExtensionContext, clientWindow: ClientWindow): void {
        super.register(context, clientWindow)

        this.runtimeExceptionDecoration = vscode.window.createTextEditorDecorationType({
            isWholeLine: true,
            gutterIconSize: "contain",
            gutterIconPath: context.asAbsolutePath("assets/icons/exception.svg"),
            light: {
                backgroundColor: "rgba(255, 43, 15, 0.35)",
                overviewRulerColor: "rgba(255, 43, 15, 0.35)"
            },
            dark: {
                backgroundColor: "rgba(255, 43, 15, 0.2)",
                overviewRulerColor: "rgba(255, 43, 15, 0.2)"
            },
            overviewRulerLane: vscode.OverviewRulerLane.Full
        })
    }

    async execute(context: vscode.ExtensionContext): Promise<void> {
        const activeTextEditor = vscode.window.activeTextEditor
        if (!activeTextEditor) {
            vscode.window.showErrorMessage("There is no opened file in the editor")
            return
        }

        if (!this.validateFileType(activeTextEditor.document)) {
            return
        }

        if (this.running) {
            vscode.window.showErrorMessage("An action is already running")
            this.outputChannel.show()
            return
        }

        const activeFilePath = activeTextEditor.document.uri.fsPath
        const activeFileName = path.basename(activeFilePath)
        activeTextEditor.setDecorations(this.runtimeExceptionDecoration, [])

        try {
            this.running = true
            this.logger.info(`Executing command Run Action on ${activeFilePath}`)
            this.outputChannel.show(true)
            this.outputChannel.appendLine("\n")
            const scriptContent = await this.getScriptContent(activeTextEditor.document)

            this.outputChannel.appendLine(`# Running ${activeFileName}`)
            const supportsSysLog = await this.supportsSysLog()
            const token = await this.runScript(context, scriptContent, supportsSysLog)
            this.outputChannel.appendLine(`# Execution ID: ${token}\n`)
            const finalState = await this.waitToFinish(token, activeTextEditor, supportsSysLog)
            const duration = await this.calculateExecutionTime(token)
            const finished = finalState.charAt(0).toUpperCase() + finalState.slice(1)
            this.outputChannel.appendLine(`\n# ${finished} after ${duration}`)
        } catch (e) {
            const errorMessage = typeof e === "string" ? e : e.message
            this.outputChannel.appendLine(`# An error occurred: ${errorMessage}`)
            vscode.window.showErrorMessage(errorMessage)
        } finally {
            this.running = false
        }
    }

    private validateFileType(document: vscode.TextDocument): boolean {
        if (document.languageId !== "javascript" && document.languageId !== "typescript") {
            vscode.window.showErrorMessage("The currently opened file is not a TypeScript or JavaScript file")
            return false
        }

        if (!this.config.vrdev.experimental.typescript && document.languageId === "typescript") {
            vscode.window.showErrorMessage(
                "Running a TypeScript action is experimental feature and " +
                    "must be enabled via the `vrdev.experimental.typescript` setting"
            )
            return false
        }

        return true
    }

    private async getScriptContent(document: vscode.TextDocument): Promise<string> {
        if (document.languageId === "javascript") {
            return document.getText()
        }

        if (document.languageId === "typescript") {
            let inputFilePath = document.uri.fsPath
            let inputFileName = path.basename(inputFilePath)
            let tsNamespace: string | undefined
            let rootPath: string
            let srcPath: string

            if (!document.isUntitled) {
                const workspacePath = vscode.workspace.getWorkspaceFolder(document.uri)
                if (!workspacePath) {
                    throw new Error(`File ${inputFileName} is not part of the workspace`)
                }

                rootPath = workspacePath.uri.fsPath
                srcPath = path.join(rootPath, "src")
                const pomFilePath = path.join(workspacePath.uri.fsPath, "pom.xml")

                if (!fs.existsSync(pomFilePath)) {
                    throw new Error(`Missing pom.xml in workspace ${workspacePath.name}`)
                }

                const pomFile = new PomFile(pomFilePath)
                tsNamespace = `${pomFile.groupId}.${pomFile.artifactId}`
            } else {
                rootPath = tmp.dirSync({ prefix: "o11n-ts-" }).name
                srcPath = path.join(rootPath, "src")
                inputFileName = inputFileName.endsWith(".ts") ? inputFileName : `${inputFileName}.ts`
                inputFilePath = path.join(srcPath, inputFileName)
                fs.mkdirpSync(path.dirname(inputFilePath))
                fs.writeFileSync(inputFilePath, document.getText(), { encoding: "utf8" })
            }

            this.outputChannel.appendLine(`# Compiling ${inputFileName}`)
            const tsFileRelativePath = path.relative(srcPath, inputFilePath)
            this.logger.debug(`Input TS file: ${inputFilePath}`)
            const outputFilePath = await this.vrotsc.compileFile(tsFileRelativePath, rootPath, tsNamespace)
            this.logger.debug(`Output JS file: ${outputFilePath}`)
            const scriptContent = fs.readFileSync(outputFilePath, { encoding: "utf8" })

            return scriptContent
        }

        return Promise.reject(`Unsupported language ID: ${document.languageId}`)
    }

    private async runScript(
        context: vscode.ExtensionContext,
        scriptContent: string,
        supportsSysLog: boolean
    ): Promise<string> {
        try {
            this.logger.info(`Checking if workflow with ID ${RUN_SCRIPT_WORKFLOW_ID} exists in target vRO`)
            await this.restClient.getWorkflow(RUN_SCRIPT_WORKFLOW_ID)
        } catch (e) {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Window
                },
                progress => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            this.logger.debug(`Error: ${e.message}`)
                            progress.report({ message: "Downloading exec package" })
                            this.logger.info("Downloading package 'com.vmware.pscoe.o11n.exec'.")
                            const execPackage = await this.getExecPackage(context)
                            progress.report({ message: "Importing exec package in vRO" })
                            this.logger.info("Importing package 'com.vmware.pscoe.o11n.exec'.")
                            await this.restClient.importPackage(execPackage)
                            resolve()
                        } catch (e) {
                            const errorMessage = `Could not import exec package into vRO: ${e.message}`
                            reject(errorMessage)
                        }
                    })
                }
            )
        }

        let fileContent = scriptContent
        const hasIife = IIFE_WRAPPER_PATTERN.exec(fileContent)
        if (hasIife && hasIife.length > 0) {
            fileContent = hasIife[1]
        }

        this.logger.info(`Running workflow ${RUN_SCRIPT_WORKFLOW_ID}`)
        const params = [
            {
                name: "script",
                type: "string",
                value: {
                    string: { value: fileContent }
                }
            },
            {
                name: "printInOutput",
                type: "boolean",
                value: {
                    boolean: { value: !supportsSysLog }
                }
            }
        ]

        const token = await this.restClient.startWorkflow(RUN_SCRIPT_WORKFLOW_ID, ...params)
        return token
    }

    private async getExecPackage(context: vscode.ExtensionContext): Promise<string> {
        const storagePath = context["globalStoragePath"]
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath)
        }

        await this.mavenProxy.copyDependency(
            "com.vmware.pscoe.o11n",
            "exec",
            this.environment.buildToolsVersion,
            "package",
            storagePath
        )
        return path.join(storagePath, "exec.package")
    }

    private async waitToFinish(token: string, editor: vscode.TextEditor, supportsSysLog: boolean): Promise<string> {
        const printedMessages = new Set<string>()
        let lastLogTimestamp = 0
        let state = "initializing"

        do {
            if (supportsSysLog) {
                lastLogTimestamp = await this.printMessagesSince(token, printedMessages, lastLogTimestamp, editor)
            }
            await sleep(200)
            state = await this.restClient.getWorkflowExecutionState(RUN_SCRIPT_WORKFLOW_ID, token)
            this.logger.debug(`Workflow ${RUN_SCRIPT_WORKFLOW_ID} execution state: ${state}`)
        } while (["completed", "failed", "canceled"].indexOf(state) < 0)

        if (supportsSysLog) {
            await sleep(1500)
            await this.printMessagesSince(token, printedMessages, lastLogTimestamp, editor)
        } else {
            const execution = await this.restClient.getWorkflowExecution(RUN_SCRIPT_WORKFLOW_ID, token)
            const logs = execution["output-parameters"][0].value.string.value
            this.outputChannel.appendLine(logs)
        }

        return state
    }

    private async printMessagesSince(
        token: string,
        printedMessages: Set<string>,
        lastLogTimestamp: number,
        editor: vscode.TextEditor
    ): Promise<number> {
        const timestamp = Date.now() - 10000 // 10sec earlier
        const logs = await this.restClient.getWorkflowLogs(RUN_SCRIPT_WORKFLOW_ID, token, "debug", lastLogTimestamp)
        logs.forEach(logMessage => {
            const timestamp = moment(logMessage.timestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")
            const msg = `[${timestamp}] [${logMessage.severity}] ${logMessage.description}`
            if (!printedMessages.has(msg)) {
                this.outputChannel.appendLine(msg)
                printedMessages.add(msg)

                const hasErrorLineNumber = SCRIPT_ERROR_LINE_PATTERN.exec(msg)
                if (hasErrorLineNumber) {
                    this.highlightError(parseInt(hasErrorLineNumber[1], 10), hasErrorLineNumber[2], editor)
                }
            }
        })

        return timestamp
    }

    private async calculateExecutionTime(token: string): Promise<string> {
        const execution = await this.restClient.getWorkflowExecution(RUN_SCRIPT_WORKFLOW_ID, token)
        const start = moment(execution["start-date"])
        const end = moment(execution["end-date"])
        const duration = moment.duration(end.diff(start))

        return moment.utc(duration.as("milliseconds")).format("m[m] s[s]")
    }

    private highlightError(lineNumber: number, message: string, editor: vscode.TextEditor) {
        const hasIife = IIFE_WRAPPER_PATTERN.exec(editor.document.getText())

        if (hasIife) {
            const offsetIndex = hasIife.index // store the position of the beggining of the regex match
            if (offsetIndex > 0) {
                lineNumber += editor.document.positionAt(offsetIndex).line
            }
        }

        const range = editor.document.lineAt(lineNumber - 1).range
        const filename = path.basename(editor.document.uri.fsPath)
        const hoverMessage = [
            new vscode.MarkdownString(`A runtime exception ocurred while executing script _${filename}_`),
            new vscode.MarkdownString(`\`${message}\``)
        ]
        const decoration = { range, hoverMessage }
        editor.setDecorations(this.runtimeExceptionDecoration, [decoration])
    }

    private async supportsSysLog(): Promise<boolean> {
        const versionInfo = await this.restClient.getVersion()
        const version = versionInfo.version.replace(`.${versionInfo["build-number"]}`, "")

        return semver.gt(version, "7.3.1")
    }
}
