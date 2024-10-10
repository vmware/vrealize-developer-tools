/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"
import * as moment from "moment"
import * as semver from "semver"
import * as tmp from "tmp"
import { AutoWire, Logger, LogMessage, MavenCliProxy, PomFile, proc, sleep, VroRestClient } from "@vmware/vrdt-common"
import * as vscode from "vscode"

import { Commands, OutputChannels } from "../constants"
import { ConfigurationManager, EnvironmentManager } from "../system"
import { Command } from "./Command"

const IIFE_WRAPPER_PATTERN = /\(function\s*\(\)\s*{([\s\S]*)}\);?/
const SCRIPT_ERROR_LINE_PATTERN = /\(eval\)#(\d+)\)\s+(.*)/
const RUN_SCRIPT_WORKFLOW_ID = "98568979-76ed-4a4a-854b-1e730e2ef4f1"

@AutoWire
export class RunAction extends Command<void> {
    private readonly logger = Logger.get("RunAction")
    private readonly outputChannel = vscode.window.createOutputChannel(OutputChannels.RunActionLogs)
    private runtimeExceptionDecoration: vscode.TextEditorDecorationType

    private running = false

    get commandId(): string {
        return Commands.RunAction
    }

    constructor(private config: ConfigurationManager, private environment: EnvironmentManager) {
        super()
    }

    register(context: vscode.ExtensionContext): void {
        super.register(context)

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
            const actionRunner = new ActionRunner(this.config, this.environment)
            await actionRunner.prepare(context)

            await actionRunner.run(scriptContent, (version, token) => {
                this.outputChannel.appendLine(`# vRO Version: ${version}`)
                this.outputChannel.appendLine(`# Execution ID: ${token}\n`)
            })

            await actionRunner.observe(
                (message: string) => this.onLog(message),
                (lineNumber: number, message: string) => this.onError(lineNumber, message, activeTextEditor),
                (state: string, duration: string) => this.onEnd(state, duration)
            )
        } catch (e) {
            const errorMessage = typeof e === "string" ? e : e.message
            this.outputChannel.appendLine(`# An error occurred: ${errorMessage}`)
            this.logger.error(e)
            this.logger.debug(e.stack)
            vscode.window.showErrorMessage(errorMessage)
        } finally {
            this.running = false
        }
    }

    private onLog(message: string) {
        this.outputChannel.appendLine(message)
    }

    private onError(lineNumber: number, message: string, editor: vscode.TextEditor) {
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

    private onEnd(state: string, duration: string) {
        const capitalizedState = state.charAt(0).toUpperCase() + state.slice(1)
        this.outputChannel.appendLine(`\n# ${capitalizedState} after ${duration}`)
    }

    private validateFileType(document: vscode.TextDocument): boolean {
        if (document.languageId !== "javascript" && document.languageId !== "typescript") {
            vscode.window.showErrorMessage("The currently opened file is not a TypeScript or JavaScript file")
            return false
        }

        return true
    }

    private async getScriptContent(document: vscode.TextDocument): Promise<string> {
        switch (document.languageId) {
            case "javascript": {
                return document.getText()
            }
            case "typescript": {
                return this.getTypescriptContent(document)
            }
            default: {
                return Promise.reject(new Error(`Unsupported language ID: '${document.languageId}'`))
            }
        }
    }

    /**
     *
     * @param inputFile - path relative to the src folder of the project dir
     * @param projectDirPath - absolute path to the project dir
     * @param namespace - project's namespace (<groupId>.<artifactId> from pom.xml)
     *
     * @returns absolute path to the output JS file
     */
    private async compileFile(inputFile: string, projectDirPath: string, namespace?: string): Promise<string> {
        const outputDir = tmp.dirSync({ prefix: "o11n-ts-" }).name
        const vrotscBin = path.join(".", "node_modules", "@vmware-pscoe", "vrotsc", "bin", "vrotsc")
        let command = `${vrotscBin} src/ --actionsOut ${outputDir} --files ${inputFile}`

        if (namespace) {
            command += ` -n ${namespace}`
        }
        await proc.exec(command, { cwd: projectDirPath }, this.logger)

        return path.join(outputDir, inputFile.replace(/\.ts$/, ".js"))
    }

    /**
     * Return the typescript content of a vscode text document.
     * @param document - reference to the vscode document.
     *
     * @returns the compiled javascript from the typescript document.
     */
    private async getTypescriptContent(document: vscode.TextDocument): Promise<string> {
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
        const outputFilePath = await this.compileFile(tsFileRelativePath, rootPath, tsNamespace)
        this.logger.debug(`Output JS file: ${outputFilePath}`)
        const scriptContent = fs.readFileSync(outputFilePath, { encoding: "utf8" })

        return scriptContent
    }
}

class ActionRunner {
    private readonly logger = Logger.get("ActionRunner")
    private readonly restClient: VroRestClient
    private readonly mavenProxy: MavenCliProxy
    private vroVersion: string
    private executionToken: string

    constructor(config: ConfigurationManager, private environment: EnvironmentManager) {
        this.restClient = new VroRestClient(config)
        this.mavenProxy = new MavenCliProxy(environment, config.vrdev.maven, this.logger)
    }

    async prepare(context: vscode.ExtensionContext) {
        try {
            this.logger.info(`Checking if workflow with ID ${RUN_SCRIPT_WORKFLOW_ID} exists in target vRO`)
            await this.restClient.getWorkflow(RUN_SCRIPT_WORKFLOW_ID)
        } catch (e) {
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Window
                },
                progress => {
                    return new Promise<void>(async (resolve, reject) => {
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
    }

    async run(scriptContent: string, callback: (version: string, token: string) => void): Promise<void> {
        this.vroVersion = await this.getVroVersion()

        let fileContent = scriptContent
        const hasIife = IIFE_WRAPPER_PATTERN.exec(fileContent)
        if (hasIife && hasIife.length > 0) {
            fileContent = hasIife[1]
        }

        this.logger.info(`Running workflow ${RUN_SCRIPT_WORKFLOW_ID} (vRO ${this.vroVersion})`)
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
                    boolean: { value: true }
                }
            }
        ]

        this.executionToken = await this.restClient.startWorkflow(RUN_SCRIPT_WORKFLOW_ID, ...params)
        callback(this.vroVersion, this.executionToken)
    }

    private async getExecPackage(context: vscode.ExtensionContext): Promise<string> {
        const storagePath = context.globalStoragePath
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath)
        }
        // exec
        await this.mavenProxy.copyDependency(
            "com.vmware.pscoe.o11n",
            "exec",
            this.environment.buildToolsVersion,
            "package",
            storagePath
        )
        return path.join(storagePath, "exec.package")
    }

    async observe(
        onLog: (message: string) => void,
        onError: (lineNumber: number, message: string) => void,
        onEnd: (state: string, duration: string) => void
    ): Promise<void> {
        const fetchLogsStrategy = this.getLoggingStrategy(onLog, onError)
        const finalStates = ["completed", "failed", "canceled"]
        let state = "initializing"

        do {
            await fetchLogsStrategy.printMessages()
            await sleep(200)
            state = await this.restClient.getWorkflowExecutionState(RUN_SCRIPT_WORKFLOW_ID, this.executionToken)
            this.logger.debug(`Workflow ${RUN_SCRIPT_WORKFLOW_ID} execution state: ${state}`)
        } while (finalStates.indexOf(state) < 0)

        await fetchLogsStrategy.finalize()
        onEnd(state, await this.getDuration())
    }

    private getLoggingStrategy(
        onLog: (message: string) => void,
        onError: (lineNumber: number, message: string) => void
    ): FetchLogsStrategy {
        if (semver.lt(this.vroVersion, "7.4.0")) {
            return new FetchLogsPre74(onLog, onError, this.executionToken, this.restClient)
        } else if (semver.lt(this.vroVersion, "7.6.0")) {
            return new FetchLogsPre76(onLog, onError, this.executionToken, this.restClient)
        }

        return new FetchLogsPost76(onLog, onError, this.executionToken, this.restClient)
    }

    private async getDuration(): Promise<string> {
        const execution = await this.restClient.getWorkflowExecution(RUN_SCRIPT_WORKFLOW_ID, this.executionToken)
        const start = moment(execution["start-date"])
        const end = moment(execution["end-date"])
        const duration = moment.duration(end.diff(start))

        return moment.utc(duration.as("milliseconds")).format("m[m] s[s]")
    }

    private async getVroVersion(): Promise<string> {
        const versionInfo = await this.restClient.getVersion()
        return versionInfo.version.replace(`.${versionInfo["build-number"]}`, "")
    }
}

abstract class FetchLogsStrategy {
    constructor(
        protected readonly log: (message: string) => void,
        protected readonly error: (lineNumber: number, message: string) => void,
        protected readonly executionToken: string,
        protected readonly restClient: VroRestClient
    ) {}

    abstract printMessages(): Promise<void>
    abstract finalize(): Promise<void>
}

class FetchLogsPre74 extends FetchLogsStrategy {
    constructor(
        onLog: (message: string) => void,
        onError: (lineNumber: number, message: string) => void,
        executionToken: string,
        restClient: VroRestClient
    ) {
        super(onLog, onError, executionToken, restClient)
    }

    async printMessages(): Promise<void> {
        // we do nothing since vRO API below version 7.4
        // does not support getting the execution logs
    }

    async finalize(): Promise<void> {
        const execution = await this.restClient.getWorkflowExecution(RUN_SCRIPT_WORKFLOW_ID, this.executionToken)
        const logs = execution["output-parameters"][0].value.string.value
        this.log(logs)
    }
}

abstract class FetchSysLogsStrategy extends FetchLogsStrategy {
    protected readonly printedMessages = new Set<string>()
    protected lastTimestamp = 0

    constructor(
        onLog: (message: string) => void,
        onError: (lineNumber: number, message: string) => void,
        executionToken: string,
        restClient: VroRestClient
    ) {
        super(onLog, onError, executionToken, restClient)
    }

    protected abstract getLogMessages(): Promise<LogMessage[]>

    async printMessages(): Promise<void> {
        if (Logger.level === "off") {
            return
        }
        const timestamp = Date.now() - 10000 // 10sec earlier
        const logs = await this.getLogMessages()
        logs.forEach(logMessage => {
            const timestamp = moment(logMessage.timestamp).format("YYYY-MM-DD HH:mm:ss.SSS ZZ")
            const msg = `[${timestamp}] [${logMessage.severity}] ${logMessage.description}`
            if (!this.printedMessages.has(msg)) {
                this.log(msg)
                this.printedMessages.add(msg)

                const hasErrorLineNumber = SCRIPT_ERROR_LINE_PATTERN.exec(msg)
                if (hasErrorLineNumber) {
                    this.error(parseInt(hasErrorLineNumber[1], 10), hasErrorLineNumber[2])
                }
            }
        })

        this.lastTimestamp = timestamp
    }

    async finalize(): Promise<void> {
        await sleep(1500) // give some time to vRO to flush the logs on disk
        await this.printMessages()
    }
}

class FetchLogsPre76 extends FetchSysLogsStrategy {
    constructor(
        onLog: (message: string) => void,
        onError: (lineNumber: number, message: string) => void,
        executionToken: string,
        restClient: VroRestClient
    ) {
        super(onLog, onError, executionToken, restClient)
    }

    protected getLogMessages(): Promise<LogMessage[]> {
        return this.restClient.getWorkflowLogsPre76(
            RUN_SCRIPT_WORKFLOW_ID,
            this.executionToken,
            Logger.level,
            this.lastTimestamp
        )
    }
}

class FetchLogsPost76 extends FetchSysLogsStrategy {
    constructor(
        onLog: (message: string) => void,
        onError: (lineNumber: number, message: string) => void,
        executionToken: string,
        restClient: VroRestClient
    ) {
        super(onLog, onError, executionToken, restClient)
    }

    protected getLogMessages(): Promise<LogMessage[]> {
        return this.restClient.getWorkflowLogsPost76(
            RUN_SCRIPT_WORKFLOW_ID,
            this.executionToken,
            Logger.level,
            this.lastTimestamp
        )
    }
}
