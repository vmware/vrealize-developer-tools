/*
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

const major = parseInt(/^(\d+)\./.exec(process.versions.node)[1]);

if (major < 12) {
    console.error('\033[1;31m*** Please use node >=12.0.0.\033[0;0m');
    process.exit(1);
}

const cp = require('child_process');
const npmVersion = cp.execSync('npm -v', {
    encoding: 'utf8'
}).trim();

const parsedNpmVersion = /^(\d+)\.(\d+)\./.exec(npmVersion);
const majorNpmVersion = parseInt(parsedNpmVersion[1]);

if (majorNpmVersion < 7) {
    console.error('\033[1;31m*** Please use npm >=7.0.0.\033[0;0m');
    process.exit(1);
}

if (!/npm(\-cli\.js)?$/.test(process.env['npm_execpath'])) {
    console.error('\033[1;31m*** Please use npm to install dependencies.\033[0;0m');
    process.exit(1);
}
