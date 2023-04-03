vRealize Developer Tools consists of an extension for Visual Studio Code and a set of Node.js and Maven command line tools.

## Layers

![vRDT Layers](./images/vrdt-layers.png)

The toolchain consists of components in both Node.js and Maven worlds.

-   Maven
    -   Natively-supported by vRO way to express content as source code
    -   Used for dependency resolution and management
    -   A thin CLI layer with commands for packaging the source code, pushing to or pulling from vRO/vRA servers
    -   Provides templates for generating different types of vRealize projects using the Maven Archetypes toolkit
-   Node.js
    -   TypeScript CLI tools for packaging vRO content, working with the vRO polyglot runtimes (Node.js, Python, PowerShell) and transpiling TypeScript to vRO-compatible JavaScript

## Folder structure

### Visual Studio Code extension

-   **`extension`** - The VS Code extension' source

### Node.js tooling and libraries

-   **`packages/node/vrdt-common`** - code shared between all components of vRDT
-   **`packages/node/polyglotpkg`** - Packages Node.js/Python/PowerShell project into Polyglot bundle that can be executed by vRO 8.1+
-   **`packages/node/vropkg`** - CLI tool and library for transforming vRO content source through multiple forms (`JavaScript source ➡️ XML source ➡️ .package binary`)
-   **`packages/node/vrotsc`** - allows expressing every type vRO content (workflows, actions, config elements) as TypeScript source code; transpiles TypeScript into vRO-compatible JavaScript and XML ready for consumption by vRO

-   **`packages/node/vro-language-server`** - is a Node.js implementation of the [Language Server Protocol (LSP)](https://github.com/Microsoft/language-server-protocol). It analyses the information received from the vRO server and the local JS files (inside src/main/resources/) from the opened project, and maintains the semantic knowledge about them. Autocompletion features which are part of the vRDT are now updated to work with vRO 8. The plugin that was previously needed and installed in vRO is no longer required for the Autocompletion features to work. Only connection to the vRO server is required. The host details and the credentials for the connection are set in the maven user profile. The Autocompletion features in vRDT are designed and tested to work on vRO 8

***Authentication***
Support is added for token authentication in vRO 8.
Basic authentication is still supported, however, starting from vRO 8.8 it is disabled by default

Note: Connection to the vRO is required to get all the global modules, actions and plugins. Otherwise, only local files will be analyzed
Note: Basic authentication by default is not supported in vRO 8.8 and above

***Details:***

For the token authentication to work with vRDT teh following tag must be set in the maven user profile:
`<vro.auth>vra</vro.auth>` - This tag is used to enable token authentication.
`<vro.refresh.token>token value</vro.refresh.token>` - The token value
`<vro.authHost>vra-l-01a.corp.local</vro.authHost>` - Authentication host is the host that vRDT will connect to obtain the token.

Note: If username and password tags are set in the profile and it is a token authentication, a new token will generated based on these credentials. This does not apply when using the Cloud vRO. In that case, generate the token via the cloud management console (console.cloud.vmware.com) and set it up in the `<vro.refresh.token>` field.

Basic authentication (if enabled in vRO) is still in effect if the tag `<vro.auth>vra</vro.auth>` is not present in the profile.

***Currently supported autocompletion features:***
Auto-completion for local JS modules and actions. Support for typescript is still not implemented.
Auto-completion for global JS modules and actions, obtained from vRO
Auto-completion for global objects from the plugins, obtained from vRO

***Examples:***
var Class = System.getModule("com.vmware.pscoe.library.class").Class() - this works for local JS files and remote vRO files.

-   **`packages/node/vro-language-server/protocol`** - A set of [Protocol Buffer](https://developers.google.com/protocol-buffers/) message definitions that are used by the vRO language server as a serialization format for communication and storage purposes.

<!--
### Maven archetypes and CLI tools

-   **`packages/maven/archetypes`** -
-   **`packages/maven/plugins`** -
-   **`packages/maven/repository`** -
-->

### Other

-   **`wiki`** - The documentation vRealize Developer Tools. Changes to this directory are automatically reflected in the [GitHub Wiki](https://github.com/vmware/vrealize-developer-tools/).
