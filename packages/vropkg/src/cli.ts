/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as path from "path"

import * as fs from "fs-extra"
import commandLineArgs from "command-line-args"
import * as winston from "winston"

import * as t from "./types"
import { loadCertificate } from "./security"
import { parseTree } from "./parse/tree"
import { parseFlat } from "./parse/flat"
import { VroJsProjParser } from "./parse/js"
import { serializeTree } from "./serialize/tree"
import { serializeFlat } from "./serialize/flat"
import { VroJsProjRealizer } from "./serialize/js"

winston.loggers.add("vrbt", {
    // TODO add as configuration
    level: "info",
    format: winston.format.json(),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: "vrbt-error.log", level: "error" }),
        new winston.transports.File({ filename: "vrbt.log" }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
} as winston.LoggerOptions)

interface CliInputs extends commandLineArgs.CommandLineOptions {
    /** whether futher logging is in order */
    verbose: boolean
    vv: boolean

    /** whether to print out help string and exit */
    help: boolean

    /** vRealize Orchestrator native input type [vro_native_folder, vro_native_package] */
    in: string

    /** vRealize Orchestrator native output type [vro_native_folder, vro_native_package] */
    out: string

    /** vRealize Orchestrator native source path */
    srcPath: string

    /** vRealize Orchestrator native destination path */
    destPath: string

    /** vRealize Orchestrator private key PEM **/
    privateKey: string

    /** vRealize Orchestrator certificates in PEM format. The certificate with the public key must be listed last **/
    certificates: string
}

const cliOpts = [
    { name: "verbose", type: Boolean, defaultValue: false },
    { name: "vv", type: Boolean, defaultValue: false },
    { name: "help", alias: "h", type: Boolean, defaultValue: false },
    { name: "in", alias: "i", type: String },
    { name: "out", alias: "o", type: String },
    { name: "srcPath", alias: "s", type: String },
    { name: "destPath", alias: "d", type: String },
    { name: "privateKeyPEM", type: String },
    { name: "certificatesPEM", type: String },
    { name: "keyPass", type: String }
] as commandLineArgs.OptionDefinition[]

async function run() {
    const input = commandLineArgs(cliOpts, { stopAtFirstUnknown: false }) as CliInputs;
    if (!(input.verbose || input.vv)) {
        console.debug = () => {} // eslint-disable-line
    }

    let printHelp = false

    if (input._unknown) {
        console.error("Unexpected option:", input._unknown)
        printHelp = true
    }

    if (!input.srcPath) {
        console.error("Missing srcPath")
        printHelp = true
    }

    if (!input.destPath) {
        console.error("Missing destPath")
    }

    const certificateRequired = t.ProjectType[input.out] == t.ProjectType.flat
    if (certificateRequired && (!input.certificatesPEM || !input.privateKeyPEM)) {
        console.error("Missing privateKeyPEM or certificatesPEM")
        printHelp = true
    }

    if (input.help || printHelp) {
        printVersion()
        printUsage()
        return
    }
    if (t.ProjectType[input.in] == null || t.ProjectType[input.out] == null) {
        console.error("Incorrect in/out paramter")
        printVersion()
        printUsage()
        return
    }

    if (!input.keyPass) {
        console.warn(
            "No password has been specified for the private key with the --keyPass parameter. Assuming empty password has been used."
        )
    }

    winston.loggers.get("vrbt").debug(`Parsing ...`)
    let pkgPromise = null
    switch (t.ProjectType[input.in]) {
        case t.ProjectType.tree:
            pkgPromise = parseTree(input.srcPath)
            break
        case t.ProjectType.flat:
            pkgPromise = parseFlat(input.srcPath, input.destPath)
            break
        case t.ProjectType.js:
            pkgPromise = new VroJsProjParser().parse(input.srcPath)
            break
        default:
            throw new Error(`Unsupported input: ${input.in}`)
    }

    winston.loggers.get("vrbt").debug(`Parsing Completed`)

    const pkg = await pkgPromise

    // Certificate is only used to sign the package when serializing
    if (certificateRequired) {
        pkg.certificate = loadCertificate(
            input.certificatesPEM as t.PEM /* certificatesPEM is PEM of PEMs */,
            input.privateKeyPEM as t.PEM,
            input.keyPass
        )
    }

    winston.loggers.get("vrbt").debug(`Serializing ...`)

    switch (t.ProjectType[input.out]) {
        case t.ProjectType.tree:
            serializeTree(pkg, input.destPath)
            break
        case t.ProjectType.flat:
            serializeFlat(pkg, input.destPath)
            break
        case t.ProjectType.js:
            await new VroJsProjRealizer().realize(pkg, input.destPath)
            break
        default:
            throw new Error(`Unsupported output: ${input.out}`)
    }
    winston.loggers.get("vrbt").debug(`Serializing Completed`)
}

function printVersion(): void {
    const packageJsonPath = path.join(__dirname, "../package.json")
    if (fs.existsSync(packageJsonPath)) {
        const packageConfig = JSON.parse(fs.readFileSync(packageJsonPath).toString())
        console.log(`Version ${packageConfig.version}`)
    }
}

function printUsage(arg?: string): boolean {
    const usageFilePath = path.join(__dirname, "../Usage.txt")
    if (fs.existsSync(usageFilePath)) {
        console.log(fs.readFileSync(usageFilePath).toString())
    }

    return false
}

run()
