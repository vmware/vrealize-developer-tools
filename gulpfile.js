/* Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT */

const gulp = require("gulp");
const path = require("path");
const cp = require("child_process");
const fs = require("fs-extra");
const minimist = require("minimist");
const chmod = require("gulp-chmod");
const log = require("fancy-log");

const rootPath = __dirname;
const nodeModulesPathPrefix = path.resolve("./node_modules");
const isWin = /^win/.test(process.platform);
const mocha = path.join(nodeModulesPathPrefix, ".bin", "mocha") + (isWin ? ".cmd" : "");
const pbjs = path.join(nodeModulesPathPrefix, "protobufjs", "bin", "pbjs");
const pbts = path.join(nodeModulesPathPrefix, "protobufjs", "bin", "pbts");
const vsce = path.join(nodeModulesPathPrefix, ".bin", "vsce");
const tsc = path.join(nodeModulesPathPrefix, ".bin", "tsc");
const tslint = path.join(nodeModulesPathPrefix, ".bin", "tslint");
const vsctest = path.join(nodeModulesPathPrefix, "vscode", "bin", "test");

const cmdLineOptions = minimist(process.argv.slice(2), {
    boolean: ["debug", "inspect"],
    string: ["tests", "timeout", "value"],
    alias: {
        "d": "debug",
        "i": "inspect",
        "t": "tests", "test": "tests"
    },
    default: {
        debug: process.env.debug || process.env.d,
        timeout: process.env.timeout || 40000,
        tests: process.env.test || process.env.tests || process.env.t
    }
});

gulp.task("chmod-vsc-test", () => {
    return gulp.src(vsctest)
        .pipe(chmod(0o755))
        .pipe(gulp.dest(path.dirname(vsctest)));
});

gulp.task("generate-proto", (done) => {
    const root = path.join(rootPath, "language-server");
    const protoPath = path.resolve(root, "src", "proto");

    fs.emptyDirSync(path.resolve(protoPath));

    const pbjsArgs = [
        "-t", "static-module", "-w", "commonjs",
        "-o", path.resolve(protoPath, "index.js"),
        path.join(root, "..", "protocol", "src", "**", "*.proto")
    ];

    const pbtsArgs = [
        "-o", path.resolve(protoPath, "index.d.ts"),
        path.resolve(protoPath, "index.js")
    ];

    exec(pbjs, pbjsArgs);
    exec(pbts, pbtsArgs);
    done();
});

gulp.task("copy-proto", () => {
    const root = path.join(rootPath, "language-server");
    const protoSrcPath = path.resolve(root, "src", "proto");
    const protoOutPath = path.resolve(root, "out", "proto");

    fs.ensureDirSync(protoOutPath);

    return gulp
        .src("index.*", { cwd: protoSrcPath, base: protoSrcPath })
        .pipe(gulp.dest(protoOutPath));
});

gulp.task("copy-changelog", () => {
    const root = path.join(rootPath, "..");
    const changelogPath = path.resolve(root);
    const changelogOutPath = path.resolve(root, "vscode", "extension");

    return gulp
        .src("CHANGELOG.md", {
            cwd: changelogPath,
            base: changelogPath
        })
        .pipe(gulp.dest(changelogOutPath));
});

const projects = ["common", "language-server", "extension"];

gulp.task("clean", (done) => {
    projects.forEach(name => {
        var outPath = path.join(rootPath, name, "out");
        fs.removeSync(outPath);
    });

    done();
});

gulp.task("compile", ["clean", "generate-proto", "copy-proto"], (done) => {
    // TODO: Evaluate using gulp-typescript and gulp-sourcemaps
    // once they fully support project references
    exec(tsc, ["-b"], rootPath);
    done();
});

gulp.task("watch", (done) => {
    exec(tsc, ["-b", "-w"], rootPath);
    done();
});

gulp.task("lint", (done) => {
    const tsconfigFile = path.resolve(rootPath, "tsconfig.lint.json");
    exec(tslint, ["-p", tsconfigFile, "-t", "verbose", "--fix"], rootPath);
    done();
});

gulp.task("test", ["compile", "chmod-vsc-test"], (done) => {
    // run common tests
    var commonRoot = path.join(rootPath, "common");
    var commonTests = path.join(commonRoot, "src", "test", "**", "*.ts");
    testWithMocha(commonRoot, commonTests);

    // run language server tests
    var lsRoot = path.join(rootPath, "language-server");
    var lsTests = path.join(lsRoot, "src", "test", "**", "*.ts");
    testWithMocha(rootPath, lsTests);

    // run extension tests
    process.env["CODE_TESTS_PATH"] = path.join(rootPath, "extension", "out", "test");
    cp.execSync("node " + vsctest, {
        cwd: rootPath,
        stdio: "inherit",
        env: process.env
    });

    done();
});

gulp.task("package", ["lint", "test", "copy-changelog"], (done) => {
    exec(vsce, ["package", "--yarn", "--baseContentUrl", "."], rootPath);
    done();
});

gulp.task("default", ["watch"]);

function testWithMocha(root, testSrc) {
    const args = [
        "--colors", "-u", "bdd",
        "-r", "ts-node/register",
        "-r", "tsconfig-paths/register",
        "-r", "module-alias/register"
    ];

    if (cmdLineOptions.tests) {
        args.push("-g", `"${cmdLineOptions.tests}"`);
    }

    if (cmdLineOptions.inspect) {
        args.unshift("--inspect-brk");
    } else if (cmdLineOptions.debug) {
        args.unshift("--debug-brk");
    } else {
        args.push("-t", cmdLineOptions.timeout || 40000);
    }

    args.push(path.resolve(testSrc));

    exec(mocha, args, root);
}

function exec(cmd, args, cwd, stdio = "inherit") {
    console.log(`${cmd} ${args.join(" ")}`);
    return cp.spawnSync(cmd, args, { stdio, cwd });
}
