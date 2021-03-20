**Thanks for taking the time to contribute!** 👍

When contributing to this project, please first discuss the changes you wish to make via an issue before making changes.

## Table of Contents

-   [Certificate of Origin](#certificate-of-origin)
-   [Getting Started](#getting-started)
    -   [Getting the code](#getting-the-code)
    -   [Prerequisites](#prerequisites)
-   [VS Code Extension](#vs-code-extension)
    -   [Dependencies](#dependencies)
    -   [Building](#building)
    -   [Linting](#linting)
    -   [Testing](#testing)
    -   [Bundling](#bundling)
    -   [Debugging](#debugging)
-   [Submitting a Pull Request](#submitting-a-pull-request)

## Certificate of Origin

By contributing to this project you agree to the [Developer Certificate of Origin](https://cla.vmware.com/dco). All contributions to this repository must be signed as described on that page. Your signature certifies that you wrote the patch or have the right to pass it on as an open-source patch.

## Getting Started

Looking for places to contribute to the codebase? You can start by looking through the [`good-first-issue`](https://github.com/vmware/vrealize-developer-tools/labels/good-first-issue) and [`help-wanted`](https://github.com/vmware/vrealize-developer-tools/labels/status:help-wanted) issues.

### Getting the code

```
git clone https://github.com/vmware/vrealize-developer-tools.git
```

### Prerequisites

-   [Git](https://git-scm.com/)
-   [Node.js](https://nodejs.org/), `>= 12.0.0`
-   [npm](https://npmjs.com/), `>= 7.0.0`
-   [gulp CLI](https://gulpjs.com/), `>= 2.0.1`
-   [Visual Studio Code](https://code.visualstudio.com/), `>= 1.54.0`
-   For building any of the maven cli tools
    -   [Maven](https://maven.apache.org/), `>= 3.5`
    -   [JDK](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html), `1.8.0_xxx`

## VS Code Extension

### Dependencies

From a terminal, where you have cloned the repository, execute the following command to install the required dependencies:

```
npm install
```

### Building

During development you can use a watcher to make builds on changes quick and easy. From a terminal, where you have cloned the repository, execute the following command:

```
gulp watch
```

This will first do an initial full build and then watch for file changes, compiling those changes incrementally, enabling a fast, iterative coding experience.

:bulb:**Tip!** You can press <kbd>CMD+SHIFT+B</kbd> (<kbd>CTRL+SHIFT+B</kbd> on Windows, Linux) to start the watch task.

:bulb:**Tip!** You don't need to stop and restart the development version of VS Code after each change. You can just execute `Reload Window` from the command palette.

To do a complete rebuild, from a terminal, where you have cloned the repository, execute the following command:

```
gulp compile
```

### Linting

This project uses [eslint](https://eslint.org/) for code linting. You can run eslint across the code by calling `gulp lint` from a terminal. Warnings from eslint show up in the `Errors and Warnings` panel and you can navigate to them from inside VS Code.

To lint the code as you make changes you can install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension.

:scroll:**NOTE!** Linting rules that have auto-fixes available will be automatically applied on file save and during compilation.

### Testing

To run the tests execute the following from a terminal:

```
gulp test
```

### Bundling

To generate a VSIX (installation package) run the following from a terminal:

```
gulp package
```

### Debugging

#### Using VS Code

1. Open the `vrealize-developer-tools` folder
2. Ensure the required [dependencies](#dependencies) are installed
3. Start the [`watch`](#building) task
4. Choose the `Launch Extension` launch configuration from the launch dropdown in the Debug viewlet and press `F5`.

:scroll:**NOTE!** In the _[Extension Development Host]_ instance, the extension will be activated when any folder with vRO JavaScript code is opened **AND** one of the following events occurs.

-   a `.o11n/` folder is located at the root of the opened project
-   a JavaScript or TypeScript file is opened in the editor
-   a `vRealize: ...` action is executed from the command palette

> Make sure the `window.openFoldersInNewWindow` setting is not `"on"`, otherwise a new, _non-[Extension Development Host]_, window may be opened.

:bulb:**Tip!** If you make edits to the code, just execute `Reload Window` from the command palette and the debugger will reattach.

## Submitting a Pull Request

Please follow the instructions in the [PR template](.github/pull_request_template.md).
