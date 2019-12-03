/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

/* eslint-disable no-template-curly-in-string */

import { ProjectArchetypes } from "../../constants"

export const TASKS_BY_TOOLCHAIN_PARENT = {
    [ProjectArchetypes.TypeScript]: [
        {
            label: "Push",
            windows: {
                command:
                    'mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -D"vro.packageImportConfigurationAttributeValues=false"'
            },
            command:
                "mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -Dvro.packageImportConfigurationAttributeValues=false"
        },
        {
            label: "Build",
            command: "mvn clean package"
        }
    ],

    [ProjectArchetypes.Base]: [
        {
            label: "Push",
            windows: {
                command:
                    'mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -D"vro.packageImportConfigurationAttributeValues=false"'
            },
            command:
                "mvn clean package vrealize:push -DincludeDependencies=true -DskipTests -P${config:vrdev.maven.profile} -Dvro.packageImportConfigurationAttributeValues=false"
        },
        {
            label: "Pull",
            windows: {
                command:
                    'mvn vro:pull -P${config:vrdev.maven.profile} -D"vro.packageExportConfigurationAttributeValues=false"'
            },
            command:
                "mvn vro:pull -P${config:vrdev.maven.profile} -Dvro.packageExportConfigurationAttributeValues=false"
        },
        {
            label: "Push Changes",
            windows: {
                command:
                    "mvn clean package vrealize:push -P${config:vrdev.maven.profile} -DincludeDependencies=false -DskipTests -DpackageSuffix=patch -Dactions=\"$($(git diff --name-only origin/master) -join ',')\""
            },
            command:
                "mvn clean package vrealize:push -P${config:vrdev.maven.profile} -DincludeDependencies=false -DskipTests -DpackageSuffix=patch -Dactions=\"$(git diff --name-only origin/master | tr '\\n' ',' | sed 's/,$ //')\""
        }
    ],

    [ProjectArchetypes.Actions]: [
        {
            label: "Push",
            command:
                "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile}"
        },
        {
            label: "Pull",
            command: "mvn vro:pull -P${config:vrdev.maven.profile}"
        }
    ],

    [ProjectArchetypes.Xml]: [
        {
            label: "Push",
            windows: {
                command:
                    'mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile} -D"vro.packageImportConfigurationAttributeValues=false"'
            },
            command:
                "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile} -Dvro.packageImportConfigurationAttributeValues=false"
        },
        {
            label: "Pull",
            windows: {
                command:
                    'mvn vro:pull -P${config:vrdev.maven.profile} -D"vro.packageExportConfigurationAttributeValues=false"'
            },
            command:
                "mvn vro:pull -P${config:vrdev.maven.profile} -Dvro.packageExportConfigurationAttributeValues=false"
        }
    ],

    [ProjectArchetypes.Vra]: [
        {
            label: "Push",
            command:
                "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile}"
        },
        {
            label: "Pull",
            command: "mvn vra:pull -P${config:vrdev.maven.profile}"
        }
    ],

    [ProjectArchetypes.VraNg]: [
        {
            label: "Push",
            command:
                "mvn clean package vrealize:push -DincludeDependencies=false -DskipTests -P${config:vrdev.maven.profile}"
        },
        {
            label: "Pull",
            command: "mvn vra-ng:pull -P${config:vrdev.maven.profile}"
        }
    ]
}
