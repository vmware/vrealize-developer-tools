Before you continue with this section validate that all of the [prerequisites](./Setup-Developer-Workstation.md) are met.

# Use

vROps Project is a filesystem representation of vROps content into human friendly YAML and/or JSON format. The project consist of content descriptor and content container.

-   _Content Descriptor_ defines what part vROps content will be part of this project. The descriptor is a content.yaml file in the root directory of a project
-   _Content Container_ holds the actual content representation. Each individual content object is represented in a JSON format in a separate file.

## Crate New vROps Project

**vRealize Build Tools** provides ready to use project templates (_maven archetypes_).

To create a new vROps project from archetype use the following command:

```Bash
mvn archetype:generate \
    -DinteractiveMode=false \
    -DarchetypeGroupId=com.vmware.pscoe.vrops.archetypes \
    -DarchetypeArtifactId=package-vrops-archetype \
    -DarchetypeVersion=<iac_for_vrealize_version> \
    -DgroupId=local.corp.it.cloud \
    -DartifactId=catalog
```

The result of this command will produce the following project file structure:

```
vrops
├── README.md
├── content.yaml
├── pom.xml
├── release.sh
└── src
    └── main
        └── dashboards
            └── dashboard.yaml
        └── views
            └── resources
            └── source.json
        └── alertdefinitions
            └── generated_dir_name
                └── alert_definition.json
        └── symptomdefinitions
            └── generated_dir_name
			    └── symptom_definition.json
        └── policies
            └── policy.xml
            └── policy.group
        └── supermetrics
            └── supermetric.json
        └── recommendations
            └── recommendation.json
        └── metricconfigs
            └── metricconfig.xml
        └── reports
          └── reportDir
            └── resources
            └── content.xml
```

Content Descriptor is implemented by content.yaml file with the following defaults.

**Note**: `generated_dir_name` in the above directory structure is auto generated on the fly.

**Note**: _vROps Project supports only content types outlined into content descriptor._

```
---
# Example describes export of:
#   Dashboard with name "dashboard01"
#   Custom form for "blueprint" with name "blueprint"
#   Subscription with name "subscription"
#   Flavor mappings with names "small" and "medium" in all regions linked to cloud accounts with tag "env:dev"
#
# Example describes import of:
#   All blueprints in src/blueprints with their custom forms in src/custom-forms
#   All subscriptions in src/blueprints
#   All flavor mappings in regions/ into regions linked to cloud accounts with tags "env:dev" or "env:test"

dashboard:
  - dashboard01
view:
  - view01
alert-definition:
  - definition01
  - definition02
symptom-definition:
  - symptom01
policy
  - name: policy01
    custom-groups:
    - group01
    - group02
  - name: policy02
    custom-groups:
    - group03
super-metric
  - supermetric01
recommendation
  - recommendation01
metric-config:
  - metricconfig01
report
  - report01
...%
```

To capture the state of your vROps environment simply fill in the names of the content objects you would like to capture and look at the Pull section of this document.

**Note**: _Due to limitation of the vROPs CLI the import / export of report definitions is not currently supported._

**Note**: _The import(push) of the symptoms definitions defined for all the adapter types is not currently supported._

## Building

You can build any vROps project from sources using Maven:

```bash
mvn clean package
```

This will produce a vROps bundle with the groupId, artifactId and version specified in the pom. For example:

```xml
<project>
    <groupId>local.corp.it.cloud</groupId>
    <artifactId>vrops</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>vrops</packaging>
</project>
```

will result in **local.corp.it.cloud.vrops-1.0.0-SNAPSHOT.vrops** generated in the target folder of your project.

## Pull

When working on a vROps project, you mainly make changes on a live server using the vROps UI and then you need to capture those changes in the maven project on your filesystem.

To support this use case, the toolchain comes with a custom goal "vrops:pull". The following command will "pull" the content outlined into _Content Descriptor_ file to the current project from a specified server and expand its content in the local filesystem overriding any local content:

```bash
vrops:pull -Dvrops.host=vrops-l-01a.corp.local -Dvrops.port=22 -Dvrops.httpPort=443 -Dvrops.username=root -Dvrops.password=VMware1! -Dvrops.restUser=admin  -Dvrops.restPassword=VMware1!  -Dvrops.dashboardUser=admin
```

A better approach is to have the different vROps development environments specified as profiles in the local
settings.xml file by adding the following snippet under "profiles":

```xml
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vROps Connection-->
        <vrops.host>192.168.75.1</vrops.host>
        <vrops.port>22</vrops.port>
        <vrops.httpPort>443</vrops.httpPort>
        <vrops.username>root</vrops.username>
        <vrops.password>VMware1!</vrops.password>
        <vrops.restUser>admin</vrops.restUser>
        <vrops.restPassword>VMware1!</vrops.restPassword>
        <vrops.dashboardUser>admin</vrops.dashboardUser>
        <vrealize.ssl.ignore.hostname>true</vrealize.ssl.ignore.hostname>
        <vrealize.ssl.ignore.certificate>true</vrealize.ssl.ignore.certificate>
    </properties>
</profile>
```

Then, you can sync content back to your local sources by simply activating the profile:

```bash
mvn vrops:pull -Pcorp-env
```

> Note that `vrops:pull` will fail if the content.yaml is empty or it cannot find some of the described content
> on the target vROps server.

## Push

To deploy the code developed in the local project or checked out from source control to a live server, you can use
the `vrops:push` command:

```bash
mvn package vrops:push -Pcorp-env
```

This will build the package and deploy it to the environment described in the `corp-env` profile. There are a few
additional options.

## Authentication

Only basic authentication is currently supported.

### Ignore Certificate Errors (Not recommended)

> This section describes how to bypass a security feature in development/testing environment. **Do not use those flags when targeting production servers.** Instead, make sure the certificates have the correct CN, use FQDN to access the servers and add the certificates to Java's key store (i.e. cacerts).

You can ignore certificate errors, i.e. the certificate is not trusted, by adding the flag `-Dvrealize.ssl.ignore.certificate`:

```bash
mvn package vrops:push -Pcorp-env -Dvrealize.ssl.ignore.certificate
```

You can ignore certificate hostname error, i.e. the CN does not match the actual hostname, by adding the flag `-Dvrealize.ssl.ignore.certificate`:

```bash
mvn package vrops:push -Pcorp-env -Dvrealize.ssl.ignore.hostname
```

You can also combine the two options above.

The other option is to set the flags in your Maven's settings.xml file for a specific **development** environment.

```xml
<profile>
    <id>corp-dev</id>
    <properties>
        <!--vROps Connection-->
        <vrops.host>192.168.75.1</vrops.host>
        <vrops.port>22</vrops.port>
        <vrops.httpPort>443</vrops.httpPort>
        <vrops.username>root</vrops.username>
        <vrops.password>VMware1!</vrops.password>
        <vrops.restUser>admin</vrops.restUser>
        <vrops.restPassword>VMware1!</vrops.restPassword>
        <vrops.dashboardUser>admin</vrops.dashboardUser>
        <vrealize.ssl.ignore.hostname>true</vrealize.ssl.ignore.hostname>
        <vrealize.ssl.ignore.certificate>true</vrealize.ssl.ignore.certificate>
    </properties>
</profile>
```

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
