Before you continue with this section validate that all of the [prerequisites](./Setup-Developer-Workstation.md) are met.

# Use

vRA NG Project is a filesystem representation of vRA NG content into human friendly YAML and/or JSON format. The project consist of content descriptor and content container.

-   _Content Descriptor_ defines what part vRA NG content will be part of this project.
-   _Content Container_ holds the actual content representation.

## Cerate New vRA NG Project

**vRealize Build Tools** provides ready to use project templates (_maven archetypes_).

To create a new vRA project from archetype use the following command:

```Bash
mvn archetype:generate \
    -DinteractiveMode=false \
    -DarchetypeGroupId=com.vmware.pscoe.vra-ng.archetypes \
    -DarchetypeArtifactId=package-vra-ng-archetype \
    -DarchetypeVersion=<iac_for_vrealize_version> \
    -DgroupId=local.corp.it.cloud \
    -DartifactId=catalog
```

**Note**: _The specified <iac_for_vrealize_version> should be minimum 2.4.11_

The result of this command will produce the following project file structure:

```
catalog
├── README.md
├── content.yaml
├── pom.xml
├── release.sh
└── src
    └── main
        └── blueprints
            └── blueprint.yaml
        └── content-sources
            └── source.json
        └── custom-forms
            └── blueprint.json
            └── workflow custom form.json
        └── entitlements
            └── Blueprint.yaml
            └── Workflow.yaml
            └── ABX Action.yaml
        └── subscriptions
            └── subscription.json
        └── regions
            └── cloud-account-name~region-id
                └── flavor-mappings
                    └── small.json
                └── image-mappings
                    └── mapping.json
                └── storage-profiles
                    └── profile.json
                └── src-region-profile.json
```

Content Descriptor is implemented by content.yaml file with the following defaults.

**Note**: _vRA NG Project supports only content types outlined into content descriptor._

```yaml
---
# Example describes export of:
#   Flavor mappings with names "small" and "medium" in all regions linked to cloud accounts with tag "env:dev"
#
# Example describes import of:
#   All blueprints in src/blueprints
#   All subscriptions in src/blueprints
#   All flavor mappings in regions/ into regions linked to cloud accounts with tags "env:dev" or "env:test"
# Example vra workflow custom forms
# workflow-custom-form
#   - Custom Form 1
#   - Custom Form 2
# Example blueprints:
# blueprint:
#  - blueprint 1
#  - bluepring 2
#  - bluepring 3
# Example subscriptions:
# subscription:
#  - subscription 1
#  - subscription 2
#  - subscription 3

blueprint:
subscription:
flavor-mapping:
    - small
    - medium
image-mapping: []
storage-profile: []
region-mapping:
    cloud-account-tags:
        export-tag: "env:dev"
        import-tags: ["env:dev", "env:test"]
workflow-custom-form:
```

**Note**: _Unreleased blueprints that have custom form will be automatically released with version 1._

To capture the state of your vRA NG environment simply fill in the names of the content objects you would like to capture and look at the Pull section of this document.

To import / export custom forms you have to specify their names under the `workflow-custom-form` tag. Along with custom forms the content sources that are related to those custom forms will be imported / exported as well.
The integration end point data for each workflow that is associated with the content source will be updated as well with the one fetched from the VRA server.

## Building

You can build any vRA NG project from sources using Maven:

```bash
mvn clean package
```

This will produce a vRA NG package with the groupId, artifactId and version specified in the pom. For example:

```xml
<groupId>local.corp.it.cloud</groupId>
<artifactId>catalog</artifactId>
<version>1.0.0-SNAPSHOT</version>
<packaging>vra-ng</packaging>
```

will result in **local.corp.it.cloud.catalog-1.0.0-SNAPSHOT.vra-ng** generated in the target folder of your project.

## Pull

When working on a vRA NG project, you mainly make changes on a live server using the vRA NG Console and then you need to capture those changes in the maven project on your filesystem.

To support this use case, the toolchain comes with a custom goal "vra-ng:pull". The following command will "pull" the content outlined into _Content Descriptor_ file to the current project from a specified server and expand its content in the local filesystem overriding any local content:

```bash
vra-ng:pull -Dvrang.host=api.mgmt.cloud.vmware.com -Dvrang.csp.host=console.cloud.vmware.com -Dvra.port=443 -Dvrang.project.id={project+id} -Dvrang.refresh.token={refresh+token}
```

A better approach is to have the different vRO/vRA development environments specified as profiles in the local
settings.xml file by adding the following snippet under "profiles":

### Example profile for vRA Cloud using refresh token for authentication

```xml
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vRA NG Connection-->
        <vrang.host>api.mgmt.cloud.vmware.com</vrang.host>
        <vrang.csp.host>console.cloud.vmware.com</vrang.csp.host>
        <vrang.port>443</vrang.port>
        <vrang.project.id>{project+id}</vrang.project.id>
        <vrang.org.id>{org+id}</vrang.org.id>
		<vrang.org.name>{org+name}</vrang.org.name>
        <vrang.refresh.token>{refresh+token}</vrang.refresh.token>
        <vrang.bp.release>true</vrang.bp.release>
    </properties>
</profile>
```

### Example profile for vRA On-Prem using refresh token for authentication

```xml
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vRA NG Connection-->
        <vrang.host>vra-l-01a.corp.local</vrang.host>
        <vrang.port>443</vrang.port>
        <vrang.project.name>{project+name}</vrang.project.name>
        <vrang.org.id>{org+id}</vrang.org.id>
		<vrang.org.name>{org+name}</vrang.org.name>
        <vrang.refresh.token>{refresh+token}</vrang.refresh.token>
        <vrang.bp.release>true</vrang.bp.release>
    </properties>
</profile>
```

### Example profile for vRA On-Prem using username and password for authentication (basic auth)

```xml
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vRA NG Connection-->
        <vrang.host>vra-l-01a.corp.local</vrang.host>
        <vrang.port>443</vrang.port>
        <vrang.username>{username}</vrang.username>
        <vrang.password>{password}</vrang.password>
        <vrang.project.id>{project+id}</vrang.project.id>
        <vrang.org.id>{org+id}</vrang.org.id>
		<vrang.org.name>{org+name}</vrang.org.name>
        <vrang.bp.release>true</vrang.bp.release>
    </properties>
</profile>
```

Then, you can sync content back to your local sources by simply activating the profile:

```bash
mvn vra-ng:pull -Pcorp-env
```

> Note that `vra-ng:pull` will fail if the content.yaml is empty, or it cannot find some described content on the target vRA server.

**Note**: _As seen by the examples, you can specify project name or project id in the settings.xml or as command line
parameters. At least one of those parameters must be present in the configuration. If you define both, project id takes
precedence over project name. If you define only project name, the solution will search for a project with that name
and use it for the content operations._

**Note**: _Check the **Authentication** section of this document for details on possible authentication methods._

**Note**: _If there are workflow custom forms in the content.yaml file they will be exported from VRA as well (and placed in the custom-forms directory)._

**Note**: _If there are workflow custom forms in the content.yaml the content sources for the workflows to that custom forms are associated to will be exported as well (and placed in the content-sources directory)._

**Note**: _If no catalog entitlements are specified, all of the available entitlements will be exported._

**Note**: The value of the <vrang.org.name> tag will take precedence over the value of the <vrang.org.id> tag in case both are present (either trough settings.xml or Installer) during filtering of the cloud accounts during pull action.

## Push

To deploy the code developed in the local project or checked out from source control to a live server, you can use
the `vrealize:push` command:

```bash
mvn package vrealize:push -Pcorp-env
```

This will build the package and deploy it to the environment described in the `corp-env` profile. There are a few
additional options:

-   `vrang.bp.release` - create a new version for already released blueprint (refer to the _Blueprint Versioning_ section
    below). This option defaults to `true`. When dealing with blueprint development, you might want to set this to `false`
    in order to avoid unnecessary blueprint versions.

**Note**: _If there are custom forms in the custom-forms directory that are associated with workflows, they will be imported to the VRA server as well._

**Note**: _If there are custom forms in the custom-forms directory that are associated with workflows, the content-sources that are associated with them will be imported as well (they will be read from the content-sources directory)._

### Blueprint versioning

When pushing a blueprint to a vRA server that contains previously released blueprint with the same name as the one
being pushed, a new version will be created and released in order to maintain the intended state.
A new version will _not_ be created if the content of the blueprint has not been modified since the latest released
version in order to avoid unnecessary versioning.

If there's a custom form associated with the blueprint being imported and there's no previously released version,
an initial blueprint version (1) will be created and released in order to import the custom form.

When creating a new version in the above-described cases, the new version will be auto-generated based on the latest
version of the blueprint. The following version formats are supported with their respective incrementing rules:

| Latest version | New version         | Incrementing rules                                         |
| -------------- | ------------------- | ---------------------------------------------------------- |
| 1              | 2                   | Increment major version                                    |
| 1.0            | 1.1                 | Major and minor version - increment the minor              |
| 1.0.0          | 1.0.1               | Major, minor and patch version - incrementing the patch    |
| 1.0.0-alpha    | 2020-05-27-10-10-43 | Arbitrary version - generate a new date-time based version |

## Regional Content

The vRA 8.x philosophy is built around the concept of infrastructure definition capable of resource provisioning -
compute, network, storage and other types of resources - that builds up an abstract model for resource description.
This allows workload placement to happen dynamically based on various explicit or implicit rules. Part of this abstract
model is the definition of various mappings and profiles that provide common higher-level definitions of underlying
infrastructure objects. These definitions take the form of various mappings and profiles:

-   flavor mappings - common designation of compute resource t-shirt or other sizing
-   image mappings - common designation of VM images
-   storage profiles - a set of storage policies and configurations used for workload placement
-   network profiles - a set of network-related configurations used for network resource placement

These abstractions are related to the regions within the cloud accounts and their capabilities. They utilize the various
underlying resources which are automatically collected and organized into "fabrics" by vRA. As such, they contain
information about resources in the various connected regions and for the purpose of this project are collectively called
**regional content**.

Exporting (pulling) and importing (pushing) of regional content is achieved using a mapping definition specified in the
content manifest (content.yaml): `region-mappping`. It contains a set of mapping criteria used for exporting and
importing of content. The vRA-NG package manager handles the `export-tag` and `import-tags` entries of the
`cloud-account-tags` section of `region-mapping`.

### Export Regional Content

When exporting regional content defined in the respective content categories - `image-mapping`, `flavor-mapping`,
`storage-profile`, etc., the vRA-NG package manager takes into account the tag that is defined in the `export-tag`
entry and exports content that is related to a cloud account(s) containing this tag. The content is stored in a
directory within a unique regional directory bearing the name of the cloud account and the cloud zone id. The cloud
account and zone combination are persisted for reference to the originating environment.

### Import Regional Content

The vRA-NG package manager uses the `import-tags` entry from the content manifest (content.yaml) to (re)create regional
content targeting cloud accounts that contain one or more of the import tags. The content is taken from all of the
regional folders and regardless of its origin, it is imported to the target environment based on the `import-tags`, i.e.
related to cloud accounts possessing one or more of the import tags list.

## Release

To release a specific content uploaded on a live server, you can use the `vrealize:release` command:

```bash
mvn clean package vrealize:release -Pcorp-env -Dvrang.contentType=blueprint -Dvrang.contentNames=testBlueprint -Dvrang.version=1 -DreleaseIfNotUpdated=false
```

Only parameter vrang.version is required.
Defalut behavior for other parameters: - vrang.contentType: default value "all". Releases all supported content types. - vrang.contentNames: default value "[]". Releases all content of given types on server. - vrang.releaseIfNotUpdated: default value "false". Skips content if there are no updates since latest version.

**Note**: Nothing will be released if any of the content already has the given version existing.

## Authentication

Use one of the two possible authentication mechanisms: refresh token or basic auth. When executing command use a profile that has either username/password set or refreshToken parameter.

```bash
vra-ng:pull -Dvrang.host=api.mgmt.cloud.vmware.com -Dvrang.csp.host=console.cloud.vmware.com -Dvra.port=443 -Dvrang.project.id={project+id} -Dvrang.refresh.token={refresh+token}
```

```bash
vra-ng:pull -Dvrang.host=api.mgmt.cloud.vmware.com -Dvrang.csp.host=console.cloud.vmware.com -Dvra.port=443 -Dvrang.project.id={project+id} -Dvrang.username={username} -Dvrang.password={password}
```

**Note**: Basic authentication is performed against an endpoint that communicates with vIDM as authentication backend.

**Note**: Username parameter accepts usernames in the form of `<username>` as well as `<username>@<domain>`. When no `<domain>` is provided, the authentication automatically assumes **System Domain**. Otherwise the provided domain will be used.
E.g. `administrator@corp.local` will perform authentication against the `corp.local` domain, whereas `configurationadmin` will perfom authentication agains `System Domain`.

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
        <vro.password>*****</vro.password>
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

Clean up is currently not supported

## Troubleshooting

-   If Maven error does not contain enough information rerun it with _-X_ debug flag.

```Bash
mvn -X <rest of the command>
```

-   Sometimes Maven might cache old artifacts. Force fetching new artifacts with _-U_. Alternatively remove _<home>/.m2/repository_ folder.

```Bash
mvn -U <rest of the command>
```
