# vRealize Developer Tools

> A [Visual Studio Code](https://code.visualstudio.com/) extension that provides code intelligence features and enables a more
> developer-friendly experience when creating [vRealize Orchestrator](https://www.vmware.com/products/vrealize-orchestrator.html)
> and [vRealize Automation](https://www.vmware.com/products/vrealize-automation.html) content.

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/vmware-pscoe.vrealize-developer-tools.svg?label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=vmware-pscoe.vrealize-developer-tools)
[![Build Status](https://github.com/vmware/vrealize-developer-tools/workflows/Build/badge.svg)](https://github.com/vmware/vrealize-developer-tools/actions)
[![Dependencies Status](https://david-dm.org/vmware/vrealize-developer-tools/status.svg)](https://david-dm.org/vmware/vrealize-developer-tools)
[![Coverage Status](https://codecov.io/gh/vmware/vrealize-developer-tools/branch/master/graph/badge.svg)](https://codecov.io/gh/vmware/vrealize-developer-tools/)

## Prerequisites

To use most of the vRealize Developer Tools's functionality, you will need a development [vRealize Orchestrator](https://www.vmware.com/products/vrealize-orchestrator.html) instance and to set up vRealize Build Tools.

-   [vRealize Build Tools v2.12.5+](https://labs.vmware.com/flings/vrealize-build-tools)
-   Access to Artifact Repository - [setup instructions](https://github.com/vmware/vrealize-developer-tools/wiki/Setup-Artifact-Repository)
-   maven v3.5+ available on the PATH system variable
-   jdk 1.8

## Install

vRDT can be installed either through the [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=vmware-pscoe.vrealize-developer-tools) or a .vsix file downloaded from the [Releases](https://github.com/vmware/vrealize-developer-tools/releases/latest) page.

To verify the checksum of a .vsix file, do the following:

1. Download all 3 files from the [Releases](https://github.com/vmware/vrealize-developer-tools/releases/latest) page (`.vsix`, `.vsix.sha256` and `.vsix.sha256.minisig`)
2. Verify the signature of the checksum file using [minisign](https://jedisct1.github.io/minisign)
    ```
    minisign -Vm vrealize-developer-tools-X.X.X.vsix.sha256 \
        -P "RWSLXIQU0b52vHvyFK7d0SQmt3he8hrZnBzwp/e30XALf4rtRc0Cluhh"
    ```
3. Verify the checksum of the vsix file
    ```
    sha256sum -c vrealize-developer-tools-X.X.X.vsix.sha256
    ```

## Upgrade steps

If you have installed any versions prior 2.0.0, do the following to upgrade.

1. Remove the old version from the VS Code Extensions panel (<kbd>Cmd+Shift+X</kbd>)
2. Reload VS Code by executing the `Reload Window` command (<kbd>Cmd+Shift+P</kbd>)
3. Install the latest version of vRealize Developer Tools.

## Contributing

If you're interested in contributing, see our [contributing guide](./.github/CONTRIBUTING.md).

## Open Source Licenses

Please see the file [open_source_licenses.txt](open_source_licenses.txt).

## License

Copyright 2018-2021 VMware, Inc.

Licensed under the [MIT](LICENSE) License.

