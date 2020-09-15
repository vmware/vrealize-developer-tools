This page describes how to consigure a vRealize engineer development machine to work with **vRealize Development Tools**.

# Install and Configure

## Prerequisites

-   [vRealize Developer Tools](https://marketplace.visualstudio.com/items?itemName=vmware-pscoe.vrealize-developer-tools)
-   Java 8 ([official installation guide](https://www.java.com/en/download/help/download_options.xml))
-   Maven 3.5+ ([official installation guide](https://maven.apache.org/install.html))
-   Development vRealize Automation Tenant configured with development vRealize Orchestrator
    -   Tenant administrator user
    -   Workstation can access vRA server on port 443
-   Development vRealize Orchestrator
    -   vRO administrator user
    -   vRO appliance root user
    -   Workstation can access vRO server on ports [443 or 8281], 8283

## Configuration

There are several things that need to be in place before you can use the toolchain to work with vRO content.

### Java Keystore

Java keystore used for signing packages build time.

```
# Create new Keystore
keytool -keystore package.jks -genkey -alias _dunesrsa_alias_ -storepass 'VMware1!' -keyalg RSA

# Delete default alias
keytool -delete -alias _dunesrsa_alias_ -keystore package.jks -storepass 'VMware1!'

# Generate new Key
keytool -genkey -keyalg RSA -keysize 2048 -alias _dunesrsa_alias_ -keystore package.jks -storepass 'VMware1!' -validity 3650 -dname 'CN=Project,OU=Department,O=Company,L=City,ST=State,C=XX,emailAddress=administrator@vsphere.local'

##  Optional  ##

# Generate Certificate Signing Request
keytool -certreq -alias _dunesrsa_alias_ -keypass 'VMware1!' -keystore package.jre -storepass 'VMware1!' -file packageCertRequest.csr

# Import the signed certificate
keytool -importcert -alias _dunesrsa_alias_ -keypass 'VMware1!' -file packageCertRequest.crt -keystore package.jks -storepass 'VMware1!'

# Export/Backup Certificate
keytool -exportcert -alias _dunesrsa_alias_ -keystore package.jks -storepass 'VMware1!' -file packageCertExport
```

`Note:` Mind the single quotes in the examples above on Windows - those might be part of the passowrd depending on which interpreter (shell) you are using. Correct the string literal and escaping appropriately for your case.

`Note:` JKS is a propriatary format specific to the particular JVM provider. When running above commands, ensure the keytool used is the one under the JVM that Maven would use (check with `mvn -v`).

### Global Configuration (_settings.xml_)

Firstly, you will need to configure Maven.

There are a number of properties that must be set through profiles in the settings.xml file, as they are environment specific:

-   keystorePassword - Required. This is the password for the keystore used for signing vRO packages.
-   keystoreLocation - Required. This is the location of the keystore. You can either hardcode a location on the machine executing the build.
-   snapshotRepositoryUrl - Required. This is the url of the snapshot maven repository.
-   releaseRepositoryUrl - Required. This is the url of the release maven repository. Could be the same as snapshotRepositoryUrl.

The recommended approach is to keep a settings XML file under SCM to be used by developers and a modified version with credentials for the Artifactory deployed on the CI server directly (i.e. not accessible by everyone).

Furthermore, in the example, bundling (i.e. should the bundle.zip be produced upon build) is moved to a separate profile
and developers/CI can choose whether to create the bundle or not by including the "-Pbundle" command line argument
to the maven invocation.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.1.0 http://maven.apache.org/xsd/settings-1.1.0.xsd"
    xmlns="http://maven.apache.org/SETTINGS/1.1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <servers>
        <server>
            <username>{vro_username}</username>
            <password>{native+maven+encrypted+pass}</password>
            <id>corp-dev-vro</id>
        </server>
        <server>
            <username>{vra_username}</username>
            <password>{native+maven+encrypted+pass}</password>
            <id>corp-dev-vra</id>
        </server>
    </servers>
    <profiles>
        <profile>
            <id>packaging</id>
            <properties>
                <keystorePassword>{keystore_password}</keystorePassword>
                <keystoreLocation>{keystore_location}</keystoreLocation>
            </properties>
        </profile>
        <profile>
            <id>bundle</id>
            <properties>
                <assembly.skipAssembly>false</assembly.skipAssembly>
            </properties>
        </profile>
        <profile>
            <id>artifactory</id>
            <repositories>
                <repository>
                    <snapshots><enabled>false</enabled></snapshots>
                    <id>central</id>
                    <name>central</name>
                    <url>http://{artifactory-hostname}/artifactory/{release_repository}</url>
                </repository>
                <repository>
                    <snapshots><enabled>true</enabled></snapshots>
                    <id>central-snapshots</id>
                    <name>central-snapshots</name>
                    <url>http://{artifactory-hostname}/artifactory/{snapshot_repository}</url>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <snapshots><enabled>false</enabled></snapshots>
                    <id>central</id>
                    <name>central</name>
                    <url>http://{artifactory-hostname}/artifactory/{release_repository}</url>
                </pluginRepository>
                <pluginRepository>
                    <snapshots><enabled>true</enabled></snapshots>
                    <id>central-snapshots</id>
                    <name>central-snapshots</name>
                    <url>http://{artifactory-hostname}/artifactory/{snapshot_repository}</url>
                </pluginRepository>
            </pluginRepositories>
            <properties>
                <releaseRepositoryUrl>http://{artifactory-hostname}/artifactory/{release_repository}</releaseRepositoryUrl>
                <snapshotRepositoryUrl>http://{artifactory-hostname}/artifactory/{snapshot_repository}</snapshotRepositoryUrl>
            </properties>
        </profile>
        <profile>
            <!--Environment identifier. Multiple environments are allowed by configuring multiple profiles -->
            <id>corp-dev</id>
            <properties>
                <!--vRO Connection-->
                <vro.host>{vro_host}</vro.host>
                <vro.port>{vro_port}</vro.port>
                <vro.username>{vro_username}</vro.username> <!--NOT RECOMMENDED USE vro.serverId and encrypted credentials-->
                <vro.password>{vro_password}</vro.password> <!--NOT RECOMMENDED USE vro.serverId and encrypted credentials-->
                <vro.serverId>corp-dev-vro</vro.serverId>
                <vro.auth>{basic|vra}</vro.auth> <!-- If "basic" is selected here, ensure com.vmware.o11n.sso.basic-authentication.enabled=true System Property is set in vRO -->
                <vro.authHost>{auth_host}</vro.authHost> <!-- Required for external vRO instances when vra auth is used -->
                <vro.authPort>{auth_port}</vro.authPort> <!-- Required for external vRO instances when vra auth is used -->
                <vro.tenant>{vro_tenant}</vro.tenant>
                <!--vRA Connection-->
                <vra.host>{vra_host}</vra.host>
                <vra.port>{vra_port}</vra.port>
                <vra.tenant>{vra_tenant}</vra.tenant>
                <vra.serverId>corp-dev-vra</vra.serverId>
                <vra.username>{vra_username}</vra.username> <!--NOT RECOMMENDED USE vra.serverId and encrypted credentials-->
                <vra.password>{vra_password}</vra.password> <!--NOT RECOMMENDED USE vra.serverId and encrypted credentials-->
            </properties>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>artifactory</activeProfile>
        <activeProfile>packaging</activeProfile>
    </activeProfiles>
</settings>
```

`Note:` {vro_username} is usually taking the form of `username`@`domain`. For vRO8 embedded in vRA8 with BASIC for {vro_auth} it will be required that only `username` part is specified for successful authentication.

### Signing

vRO packages are signed. In order to be able to use the toolchain, you have to have a keystore and
configure it in the settings.xml file both for the developers and the CI.

#### Keystore located on the building machine

You must have the keystore file accessible on the machine and set the **keystoreLocation** and **keystorePassword** properties through the settings.xml.

### Bundling

There is a built-in bundling capabilities that are described in a Maven profile. You can decide to not only package a vRO/vRA project, but also to create a `*-bundle.zip` with all its dependencies. This will create an archive with the following structure:

```sh
vro/ # all vRO packages. If the current project is vRO, its package will be here as well.
vra/ # all vRA packages. IF the current project is vRA, its package will be here as well.
repo/ # JARs that comprise the bundle installer - a CLI tool that is capable of importing the whole bundle to a target environment.
bin/ # shells for invoking the bundle installer CLI.
    installer # Bash executable version of the installer for Linux/Unix/macOS
    intasller.bat # Batch exectable version of the installer for Windows
```

The bundle is produced as a separate artifact during `mvn package`. To produce it, you need to add the `-Pbundle-with-installer` profile:

```
$ mvn clean deploy -Pbundle-with-installer
```

To learn more about the bundle installer, check [vRealize Build Tools - Bundle Installer](./use-bundle-installer.md) for more information.

### Security

All API calls from the toolchain (i.e. the client) verify the SSL certificate
returned by vRO/vRA (i.e. the server). If you are using self-signed or third-party signed certificates, you may need to
add those certificates or their CA certificates to the default JAVA keystore, i.e. `JAVA_HOME/lib/security/cacerts`. **This is the recommended approach.**

The other option, **applicable ONLY for development environments**, is to ignore certificate checks by passing a flag.
