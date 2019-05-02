/* Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT */

const gulp = require("gulp")
const gulpIf = require("gulp-if")
const path = require("path")
const cp = require("child_process")
const fs = require("fs-extra")
const minimist = require("minimist")
const log = require("fancy-log")
const eslint = require("gulp-eslint")
const release = require("./build/release")
const bumpVersion = require("./build/bump-version")

const rootPath = __dirname
const nodeModulesPathPrefix = path.resolve("./node_modules")
const isWin = /^win/.test(process.platform)
const jest = path.join(nodeModulesPathPrefix, ".bin", "jest") + (isWin ? ".cmd" : "")
const pbjs = path.join(nodeModulesPathPrefix, "protobufjs", "bin", "pbjs")
const pbts = path.join(nodeModulesPathPrefix, "protobufjs", "bin", "pbts")
const vsce = path.join(nodeModulesPathPrefix, ".bin", "vsce")
const tsc = path.join(nodeModulesPathPrefix, ".bin", "tsc")

const cmdLineOptions = minimist(process.argv.slice(2), {
    boolean: ["debug", "inspect", "fix"],
    string: ["tests", "timeout", "value"],
    alias: {
        d: "debug",
        i: "inspect",
        t: "tests",
        test: "tests"
    },
    default: {
        debug: process.env.debug || process.env.d,
        timeout: process.env.timeout || 40000,
        tests: process.env.test || process.env.tests || process.env.t
    }
})

gulp.task("generate-proto", done => {
    const root = path.join(rootPath, "language-server")
    const protoPath = path.resolve(root, "src", "proto")

    fs.emptyDirSync(path.resolve(protoPath))

    const pbjsArgs = [
        "-t",
        "static-module",
        "-w",
        "commonjs",
        "-o",
        path.resolve(protoPath, "index.js"),
        path.join(root, "..", "protocol", "src", "**", "*.proto")
    ]

    const pbtsArgs = ["-o", path.resolve(protoPath, "index.d.ts"), path.resolve(protoPath, "index.js")]

    exec(pbjs, pbjsArgs)
    exec(pbts, pbtsArgs)
    done()
})

gulp.task("copy-proto", () => {
    const root = path.join(rootPath, "language-server")
    const protoSrcPath = path.resolve(root, "src", "proto")
    const protoOutPath = path.resolve(root, "out", "proto")

    fs.ensureDirSync(protoOutPath)

    return gulp.src("index.*", { cwd: protoSrcPath, base: protoSrcPath }).pipe(gulp.dest(protoOutPath))
})

gulp.task("copy-changelog", () => {
    const root = path.join(rootPath, "..")
    const changelogPath = path.resolve(root)
    const changelogOutPath = path.resolve(root, "vscode", "extension")

    return gulp
        .src("CHANGELOG.md", {
            cwd: changelogPath,
            base: changelogPath
        })
        .pipe(gulp.dest(changelogOutPath))
})

const projects = ["common", "language-server", "extension"]

gulp.task("clean", done => {
    projects.forEach(name => {
        var outPath = path.join(rootPath, name, "out")
        fs.removeSync(outPath)

        var tsBuildInfo = path.join(rootPath, name, "tsconfig.tsbuildinfo")
        fs.removeSync(tsBuildInfo)
    })

    done()
})

gulp.task(
    "compile",
    gulp.series("generate-proto", "copy-proto", done => {
        // TODO: Evaluate using gulp-typescript and gulp-sourcemaps
        // once they fully support project references
        exec(tsc, ["-b"], rootPath)
        done()
    })
)

gulp.task("watch", done => {
    exec(tsc, ["-b", "-w"], rootPath)
    done()
})

gulp.task("lint", () => {
    return gulp
        .src(["**/src/**/*.ts", "!node_modules/**"], { cwd: rootPath })
        .pipe(eslint({ fix: !!cmdLineOptions.fix }))
        .pipe(eslint.format())
        .pipe(gulpIf(file => file.eslint && file.eslint.fixed, gulp.dest("./")))
        .pipe(eslint.failAfterError())
})

gulp.task(
    "test",
    gulp.series("compile", done => {
        const projectRoots = projects.map(name => path.join(rootPath, name))
        const args = ["--verbose", "--projects", ...projectRoots]

        if (cmdLineOptions.tests) {
            args.push("-t", `"${cmdLineOptions.tests}"`)
        }

        exec(jest, args, rootPath)
        done()
    })
)

gulp.task("test:watch", done => {
    const projectRoots = projects.map(name => path.join(rootPath, name))
    const args = ["--verbose", "--watch", "--projects", ...projectRoots]

    exec(jest, args, rootPath)
    done()
})

gulp.task(
    "package",
    gulp.series("lint", "test", done => {
        exec(
            vsce,
            [
                "package",
                "--yarn",
                "--baseContentUrl",
                "https://raw.githubusercontent.com/vmware/vrealize-developer-tools/master/",
                "--baseImagesUrl",
                "https://raw.githubusercontent.com/vmware/vrealize-developer-tools/master/"
            ],
            rootPath
        )
        done()
    })
)

gulp.task("release", () => {
    return release()
})

gulp.task("bump-version", () => {
    return bumpVersion()
})

gulp.task("default", gulp.series("watch"))

function exec(cmd, args, cwd, stdio = "inherit") {
    var cmdString = `${cmd} ${args.join(" ")}`
    log(cmdString)
    var result = cp.spawnSync(cmd, args, { stdio, cwd })
    if (result.status != 0) {
        throw new Error(`Command "${cmdString}" exited with code ` + result.status)
    }

    return result
}
