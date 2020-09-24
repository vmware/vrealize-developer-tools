/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as os from "os";
import * as path from "path";
import * as childProcess from "child_process";

import * as fs from "fs-extra";
import * as glob from "glob";
import * as ansiColors from "ansi-colors";

interface Logger {
  log(message: string): void;
  logLine(message: string): void;
}

const MAX_PARALLEL_TEST_RUNS = 8;
const currDir = process.cwd();
const e2eDir = path.join(currDir, "e2e");
const casesDir = path.join(e2eDir, "cases");
const expectDir = path.join(e2eDir, "expect");
const outDir = path.join(e2eDir, "out");
const caseSpecs = process.env.CASE_SPEC ? process.env.CASE_SPEC.split(",") : [];
const childProcLogs = process.env.CHILD_PROC_LOGS === "true" || process.env.CHILD_PROC_LOGS === "1";
const logger = createLogger();

runAllSpecs().then(succeed => {
  if (!succeed) {
    process.exit(1);
  }
});

async function runAllSpecs(): Promise<boolean> {
  logger.logLine(`Running end to end tests...`);

  const specWorkers: Promise<boolean>[] = [];
  const specNames = shuffleArray(
    fs.readdirSync(casesDir)
      .filter(caseName => caseName !== "node_modules")
      .filter(caseName => fs.lstatSync(path.join(casesDir, caseName)).isDirectory())
      .filter(caseName => !caseSpecs.length || caseSpecs.indexOf(caseName) > -1)
  );

  fs.emptyDirSync(outDir);

  const parallelWorkersCount = Math.max(1, Math.min(MAX_PARALLEL_TEST_RUNS, os.cpus().length - 1));
  const results: boolean[] = [];

  for (const specName of specNames) {
    specWorkers.push(runSpec(specName));
    if (specWorkers.length === parallelWorkersCount) {
        results.push(...await Promise.all(specWorkers));
        specWorkers.splice(0, specWorkers.length);
    }
  }

  if (specWorkers.length) {
    results.push(...await Promise.all(specWorkers));
  }

  const specCount = specNames.length;
  const specFailedCount = results.filter(r => !r).length;

  logger.logLine(`${specCount} specs, ${specFailedCount} failures`);

  return !specFailedCount;
}

async function runSpec(caseName: string): Promise<boolean> {
  const output: string[] = [];

  let passed = await compile();
  if (passed) {
    try {
      compare();
    }
    catch (e) {
      passed = false;
    }
  }

  let message = `${caseName} ${passed ? ansiColors.green("passed") : ansiColors.red("failed")}`;
  if (output.length) {
    message += `\n${output.join("\n")}`;
  }
  logger.logLine(message);

  return passed;

  async function compile(): Promise<boolean> {
    const caseOutDir = path.join(outDir, caseName);
    await fs.emptyDir(caseOutDir);
    const cmdArgs = [
      path.join(currDir, "lib", "vrotsc.js"),
      caseName,
      "--actionsNamespace",
      "com.vmware.pscoe.vrotsc",
      "--workflowsNamespace",
      "PSCoE/vRO TypeScript",
       "--actionsOut",
      path.join(caseOutDir, "actions"),
      "--workflowsOut",
      path.join(caseOutDir, "workflows"),
      "--configsOut",
      path.join(caseOutDir, "configs"),
      "--testsOut",
      path.join(caseOutDir, "tests"),
      "--typesOut",
      path.join(caseOutDir, "types"),
      "--resourcesOut",
      path.join(caseOutDir, "resources"),
      "--policiesOut",
      path.join(caseOutDir, "policies")
    ];

    if (childProcLogs) {
      output.push(`Project compilation command: 'node ${ansiColors.cyan(cmdArgs.join(" "))}'`);
    }

    const proc = childProcess.spawn("node", cmdArgs, {
      cwd: casesDir,
      env: process.env
    });

    proc.stdout.on("data", data => {
      output.push(`${ansiColors.gray("info")} ${data}`);
    });

    proc.stderr.on("data", data => {
      output.push(`${ansiColors.red("error")} ${data}`);
    });

    return new Promise(resolve => {
      proc.on("close", exitCode => {
        resolve(exitCode === 0);
      });
    });
  }

  function compare(): void {
    const expectCaseDir = path.join(expectDir, caseName);
    const caseOutDir = path.join(outDir, caseName);

    glob.sync(path.resolve(caseOutDir, "**/*"))
      .forEach(actualPath => {
        const expectPath = path.join(
          expectCaseDir,
          path.relative(caseOutDir, actualPath)
        );
        expect(fs.existsSync(expectPath)).toBe(true, `Path '${expectPath}' does not exist`);
        expect(fs.lstatSync(actualPath).isFile()).toBe(
          fs.lstatSync(expectPath).isFile(),
          `File ${actualPath} does not match ${expectPath}`);
      });

    glob
      .sync(path.resolve(expectCaseDir, "**/*"), { nodir: true })
      .forEach(expectFilePath => {
        const actualFilePath = path.join(
          caseOutDir,
          path.relative(expectCaseDir, expectFilePath)
        );
        expect(fs.existsSync(actualFilePath)).toBe(
          true,
          `File '${actualFilePath}' does not exist.`
        );
        expect(readFile(expectFilePath)).toBe(
          readFile(actualFilePath),
          `Expected file '${expectFilePath}' does not match actual file '${actualFilePath}'.`
        );
      });
  }

  function expect(actualValue: any) {
    return {
      toBe: function (expectedValue: any, message: string) {
        if (actualValue !== expectedValue) {
          output.push(message)
          throw new Error(message);
        }
      },
      notToBe: function (expectedValue: any, message: string) {
        if (actualValue === expectedValue) {
          output.push(message)
          throw new Error(message);
        }
      }
    };
  }
}

function createLogger(): Logger {
  let isLineStart = true;
  return { log, logLine };

  function log(message): void {
    if (isLineStart) {
      const format = (n: number) => (`0${ n}`).slice(-2);
      const now = new Date();
      const timeString = `${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;
      message = `[${timeString}] ${message}`;
    }

    process.stdout.write(message);
    isLineStart = false;
  }

  function logLine(message: string): void {
    log(`${message}\n`);
    isLineStart = true;
  }
}

function readFile(path: string): string {
  return fs.readFileSync(path).toString().replace(/\r\n/g, "\n");
}

function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}
