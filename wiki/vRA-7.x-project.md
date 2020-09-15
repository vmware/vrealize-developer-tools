Before you continue with this section validate that all of the [prerequisites](./Setup-Developer-Workstation.md) are met.

# Use

vRA Project is a filesystem representation of vRA content into human frendly YAML format. The project consist of content descriptor and content container.

-   _Content Descriptor_ defines what part vRA content will be part of this project.
-   _Content Container_ holds the actual content representation.

## Crate New vRA Project

**vRealize Build Tools** prvides ready to use project templates (_maven archetypes_).

To create a new vRA project from archetype use the following command:

```Bash
mvn archetype:generate \
    -DinteractiveMode=false \
    -DarchetypeGroupId=com.vmware.pscoe.vra.archetypes \
    -DarchetypeArtifactId=package-vra-archetype \
    -DarchetypeVersion=<iac_for_vrealize_version> \
    -DgroupId=local.corp.it.cloud \
    -DartifactId=catalog
```

The result of this command will produce the following project file structure:

```
catalog
├── README.md
├── content.yaml
├── pom.xml
├── release.sh
└── src
    └── main
```

Content Descriptor is implemented by content.yaml file with the following defaults.

**Note**: _vRA Project supports only content types outlined into content descriptor._

```
---
# Example describing for export Composite blueprints by their names
#
# composite-blueprint:
#   - SQL 2016 Managed
#   - Kubernates 1.9.0

property-group:
property-definition:
software-component:
composite-blueprint:
xaas-blueprint:
xaas-resource-action:
xaas-resource-type:
xaas-resource-mapping:
workflow-subscription:
global-property-group:
global-property-definition:
...%
```

To capture the state of your vRA environment simply fill in the names of the content objects you would like to capture and look at the Pull section of this document.

## Building

You can build any vRA project from sources using Maven:

```bash
mvn clean package
```

This will produce a vRA package with the groupId, artifactId and version specified in the pom. For example:

```xml
<groupId>local.corp.it.cloud</groupId>
<artifactId>catalog</artifactId>
<version>1.0.0-SNAPSHOT</version>
<packaging>vra</packaging>
```

will result in **local.corp.it.cloud.catalog-1.0.0-SNAPSHOT.vra** generated in the target folder of your project.

## Pull

When working on a vRA project, you mainly make changes on a live server using the vRA Console and then you need to capture those changes in the maven project on your filesystem.

To support this use case, the toolchain comes with a custom goal "vra:pull". The following command will "pull" the content outlined into _Content Descriptor_ file to the current project from a specified server and expand its content in the local filesystem overriding any local content:

```bash
vra:pull -Dvra.host=10.29.26.18 -Dvra.port=443 -Dvra.username=configurationadmin@vsphere.local -Dvra.password=*** -Dvra.tenant=vsphere.local
```

A better approach is to have the different vRO/vRA development environments specified as profiles in the local
settings.xml file by adding the following snippet under "profiles":

```xml
<servers>
    <server>
        <username>configurationadmin@vsphere.local</username>
        <password>{native+maven+encrypted+pass}</password>
        <id>corp-dev-vra</id>
    </server>
</servers>
....
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vRA Connection-->
        <vra.host>10.29.26.18</vra.host>
        <vra.port>443</vra.port>
        <vra.tenant>vsphere.local</vra.tenant>
        <vra.serverId>corp-dev-vra</vra.serverId>
    </properties>
</profile>
```

Then, you can sync content back to your local sources by simply activating the profile:

```bash
mvn vra:pull -Pcorp-env
```

> Note that `vra:pull` will fail if the content.yaml is empty or it cannot find some of the described content
> on the target vRA server.

## Push

To deploy the code developed in the local project or checked out from source control to a live server, you can use
the `vrealize:push` command:

```bash
mvn package vrealize:push -Pcorp-env
```

This will build the package and deploy it to the environment described in the `corp-env` profile. There are a few
additional options.

## Include Dependencies

By default, the `vrealize:push` goal will deploy all dependencies of the current project to the target
environment. You can control that by the `-DincludeDependencies` flag. The value is `true` by default, so you
skip the dependencies by executing the following:

```bash
mvn package vrealize:push -Pcorp-env -DincludeDependencies=false
```

Note that dependencies will not be deployed if the server has a newer version of the same package deployed. For example,
if the current project depends on `com.vmware.pscoe.example-2.4.0` and on the server there is `com.vmware.pscoe.example-2.4.2`,
the package will not be downgraded. You can force that by adding the ``-Dvra.importOldVersions``` flag:

```bash
mvn package vrealize:push -Pcorp-env -Dvra.importOldVersions
```

The command above will forcefully deploy the exact versions of the dependent packages, downgrading anything it finds on the server.

### Ignore Certificate Errors (Not recommended)

> This section describes how to bypass a security feature in development/testing environment. **Do not use those flags when targeting production servers.** Instead, make sure the certificates have the correct CN, use FQDN to access the servers and add the certificates to Java's key store (i.e. cacerts).

You can ignore certificate errors, i.e. the certificate is not trusted, by adding the flag `-Dvrealize.ssl.ignore.certificate`:

```bash
mvn package vrealize:push -Pcorp-env -Dvrealize.ssl.ignore.certificate
```

You can ignore certificate hostname error, i.e. the CN does not match the actual hostname, by adding the flag `-Dvrealize.ssl.ignore.certificate`:

```bash
mvn package vrealize:push -Pcorp-env -Dvrealize.ssl.ignore.hostname
```

You can also combine the two options above.

The other option is to set the flags in your Maven's settings.xml file for a specific **development** environment.

```xml
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vRO Connection-->
        <vro.host>10.29.26.18</vro.host>
        <vro.port>8281</vro.port>
        <vro.username>administrator@vsphere.local</vro.username>
        <vro.password>***</vro.password>
        <vro.auth>vra</vro.auth>
        <vro.tenant>vsphere.local</vro.tenant>
        <vrealize.ssl.ignore.hostname>true</vrealize.ssl.ignore.hostname>
        <vrealize.ssl.ignore.certificate>true</vrealize.ssl.ignore.certificate>
    </properties>
</profile>
```

## Bundling

To produce a bundle.zip containing the package and all its dependencies, use:

```
$ mvn clean deploy -Pbundle
```

Refer to [vRealize Build Tools](./setup-workstation-maven.md)/Bundling for more information.

## Clean Up

To clean up a version of vRA package from the server use:

-   Clean up only curent package version from the server
    ```
    mvn vrealize:clean -DcleanUpLastVersion=true -DcleanUpOldVersions=false -DincludeDependencies=false
    ```
-   Clean up curent package version from the server and its dependencies. This is a force removal operation.
    ```
    mvn vrealize:clean -DcleanUpLastVersion=true -DcleanUpOldVersions=false -DincludeDependencies=true
    ```
-   Clean up old package versions and the old vertions of package dependencies.
    ```
    mvn vrealize:clean -DcleanUpLastVersion=false -DcleanUpOldVersions=true -DincludeDependencies=true
    ```

## Troubleshooting

-   If Maven error does not contain enough information rerun it with _-X_ debug flag.

```Bash
mvn -X <rest of the command>
```

-   Sometimes Maven might cache old artifats. Force fetching new artifacts with _-U_. Alternativelly remove _<home>/.m2/repository_ folder.

```Bash
mvn -U <rest of the command>
```
