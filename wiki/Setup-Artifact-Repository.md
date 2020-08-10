## Requirements

-   Git-based Source control system (this wiki assumes GitLab)
-   An artifact repository management system (this wiki assumes jFrog)
-   CI Server capable of running Maven commands (this wiki assumes GitLab):
    -   Git client
    -   Maven 3.5+
    -   Java 8
-   Temporary access to internet during the installation
-   vRO 7.6 Appliance - the toolchain uses vRO 7.6 dependencies that are part of the appliance and are served as an embedded Maven repository.

## Installation

### Uploading toolchain artifacts to Artifactory

_Note that the libs-release, libs-snapshot etc. are the default Maven repositories created by JFrog's **Quick Setup** shown at first login. This guide assumes that this **Quick Setup** has been executed._

1. Create a local repository in artifactory to contain the toolchain artifacts, e.g. **vrealize-build-tools** and add it to the virtual release repository (e.g. **libs-release**)
2. Unzip **iac-maven-repository.zip** found at **artifacts/maven/** path relative to the root of the toolchain bundle to a folder, e.g. **import/**
3. Go to the directory where you have unzipped the archive. Your working directory should contain the "com" folder and the **archetype-catalog.xml** file, e.g.:

```bash
root@photon-G6H8GzV2j [ ~/toolchain/import ]# ls
archetype-catalog.xml  com
```

5. Then, run the following command `jfrog rt u --recursive=true --flat=false ./ vrealize-build-tools`, where **vrealize-build-tools** should be the name of the repository you've created at step #1.
6. Examine the output of the command. It should look something similar to this:

```
Uploading artifact: /path/to/artifact/some-artifact.jar
{
  "status": "success",
  "totals": {
    "success": 1,
    "failure": 0
  }
}
```

## Upload vRO artifacts to Artifactory

First you need access to a 7.3 vRO appliance to get the vRO dependencies for the toolchain in your artifactory.

1. Get all vRO artifacts on the local machine. Run:

```
wget --no-check-certificate --recursive --no-parent --reject "index.html*" https://<vro_ip>:<vro_port>/vco-repo/com/
wget --no-check-certificate --recursive --no-parent --reject "index.html*" https://<vro_ip>:<vro_port>/vco-repo/com/vmware/o11n/mojo/pkg/
wget --no-check-certificate --recursive --no-parent --reject "index.html*" https://<vro_ip>:<vro_port>/vco-repo/com/vmware/o11n/pkg
```

2. Create a new local repository (e.g. **vro-local**) and add it to the virtual release repository (e.g. **libs-release**).
3. Navigate to the root folder of the downloaded repository on the local filesystem - at the same level as the **com** directory. E.g.:

```bash
root@photon-G6H8GzV2j [ ~/192.168.71.1/vco-repo ]# ls
com
```

4. Import the vro artifacts to the selected repository, for example:

```
jfrog rt u --recursive true --flat false ./ vro-local
```

### Configure permissions for local cache for the Anonymous user

1. Login into Artifactory with admin privileges
2. Navigate to **Admin > Permissions**
3. Click the **New** button
4. Add a name for the permissions (for example: Anonymous Cache)
5. Add all repositories into the **Selected Repositories** list view
6. Skip the groups section
7. On the **Users** section add **Anonymous** user
8. Give **Deploy/Cache, Annotate, Read** permissions
9. Click **Save & Finish**

# Next step

-   Configure developer **[Workstation](./Setup-Workstation.md)**
