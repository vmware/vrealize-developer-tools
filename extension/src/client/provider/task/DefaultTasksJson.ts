/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

// tslint:disable:max-line-length

export const TASKS_BY_TOOLCHAIN_PARENT = {
    "com.vmware.pscoe.o11n:typescript-project": [{
        label: "Push",
        windows: {
            command: "mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -D\"vro.packageImportConfigurationAttributeValues=false\""
        },
        command: "mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -Dvro.packageImportConfigurationAttributeValues=false"
    }, {
        label: "Build",
        command: "mvn clean package"
    }],

    "com.vmware.pscoe.o11n:base-package": [{
        label: "Push",
        windows: {
            command: "mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -D\"vro.packageImportConfigurationAttributeValues=false\""
        },
        command: "mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -Dvro.packageImportConfigurationAttributeValues=false"
    }, {
        label: "Pull",
        windows: {
            command: "mvn vro:pull -P${config:vrdev.maven.profile} -D\"vro.packageExportConfigurationAttributeValues=false\""
        },
        command: "mvn vro:pull -P${config:vrdev.maven.profile} -Dvro.packageExportConfigurationAttributeValues=false"
    }, {
        label: "Push Changes",
        windows: {
            command: "mvn clean package vrealize:push -P${config:vrdev.maven.profile} -DincludeDependencies=false -DskipTests -DpackageSuffix=patch -Dactions=\"$($(git diff --name-only origin/master) -join ',')\""
        },
        command: "mvn clean package vrealize:push -P${config:vrdev.maven.profile} -DincludeDependencies=false -DskipTests -DpackageSuffix=patch -Dactions=\"$(git diff --name-only origin/master | tr '\\n' ',' | sed 's/,$ //')\""
    }],

    "com.vmware.pscoe.o11n:actions-package": [{
        label: "Push",
        command: "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile}"
    }, {
        label: "Pull",
        command: "mvn vro:pull -P${config:vrdev.maven.profile}"
    }],

    "com.vmware.pscoe.o11n:xml-package": [{
        label: "Push",
        windows: {
            command: "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile} -D\"vro.packageImportConfigurationAttributeValues=false\""
        },
        command: "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile} -Dvro.packageImportConfigurationAttributeValues=false"
    }, {
        label: "Pull",
        windows: {
            command: "mvn vro:pull -P${config:vrdev.maven.profile} -D\"vro.packageExportConfigurationAttributeValues=false\""
        },
        command: "mvn vro:pull -P${config:vrdev.maven.profile} -Dvro.packageExportConfigurationAttributeValues=false"
    }],

    "com.vmware.pscoe.vra:vra-package": [{
        label: "Push",
        command: "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile}"
    }, {
        label: "Pull",
        command: "mvn vra:pull -P${config:vrdev.maven.profile}"
    }]
}
