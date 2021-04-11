Before you continue with this section validate that all of the [prerequisites](./Setup-Developer-Workstation.md) are met.

# Use

Polyglot Project is a development project representation of Polyglot action package content.

## Create New Polyglot Project

**vRealize Build Tools** provides ready to use project templates (_maven archetypes_).

To create a new Polyglot project from archetype use the following commands for the respective runtime:

```Bash
# NodeJS
mvn archetype:generate \
    -DinteractiveMode=false \
    -DarchetypeGroupId=com.vmware.pscoe.polyglot.archetypes \
    -DarchetypeArtifactId=package-polyglot-archetype \
    -DarchetypeVersion=<iac_for_vrealize_version> \
    -DgroupId=local.corp.it.cloud \
    -DartifactId=polyglot \
    -Druntime=nodejs \
    -Dtype=polyglot

# Python
mvn archetype:generate \
    -DinteractiveMode=false \
    -DarchetypeGroupId=com.vmware.pscoe.polyglot.archetypes \
    -DarchetypeArtifactId=package-polyglot-archetype \
    -DarchetypeVersion=<iac_for_vrealize_version> \
    -DgroupId=local.corp.it.cloud \
    -DartifactId=polyglot \
    -Druntime=python \
    -Dtype=polyglot

# PowerShell
mvn archetype:generate \
    -DinteractiveMode=false \
    -DarchetypeGroupId=com.vmware.pscoe.polyglot.archetypes \
    -DarchetypeArtifactId=package-polyglot-archetype \
    -DarchetypeVersion=<iac_for_vrealize_version> \
    -DgroupId=local.corp.it.cloud \
    -DartifactId=polyglot \
    -Druntime=powershell \
    -Dtype=polyglot
```

**Note**: _The specified <iac_for_vrealize_version> should be minimum 2.7.1_

The generated project from the archetype is specific to the runtime, i.e. the src directory will contain .py files
for Python projects, .ts files for NodeJS projects and .ps1 files for PowerShell projects.

The result of this command will produce the following project file structure (example for NodeJS):

```
.
├── README.md
├── handler.debug.yaml
├── license_data
│   ├── licenses.properties
│   └── tp_license
│       ├── header.txt
│       └── license.txt
├── package.json
├── pom.xml
├── release.sh
├── src
│   └── handler.ts
└── tsconfig.json
```

## Building

You can build any Polyglot project from sources using Maven:

```bash
mvn clean package
```

This will produce a vRO package with the groupId, artifactId and version specified in the pom. For example:

```xml
<groupId>local.corp.it.cloud</groupId>
<artifactId>polyglot</artifactId>
<version>1.0.0-SNAPSHOT</version>
<packaging>package</packaging>
```

will result in **local.corp.it.cloud.polyglot-1.0.0-SNAPSHOT.package** generated in the target folder of your project.

## Configuration

## Pull

Polyglot action pulling is not supported yet.

## Push

You can depend on a Polyglot project in your
vRO Typescript or vRO JavaScript project, which will bundle and import the Polyglot action (along with other dependencies)
as you push your vRO content.

Standalone Polyglot action push is not supported yet using Maven.

## Troubleshooting

-   If Maven error does not contain enough information rerun it with _-e_ debug flag. This will output the stack trace
    at the point where the error is encountered.

```bash
mvn -e <rest of the command>
```

-   Additionally, debug information can be really helpful when troubleshooting a particular scenario. In order to
    increase the verbosity of the logs, you can use the _-X_ debug flag.

```bash
mvn -X <rest of the command>
```

-   Sometimes Maven might cache old artifacts. Force fetching new artifacts with _-U_.
    Alternatively remove _<home>/.m2/repository_ folder.

```bash
mvn -U <rest of the command>
```
