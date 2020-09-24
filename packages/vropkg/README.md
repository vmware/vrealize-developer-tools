# Project Structures

## XML Tree (Expanded Package Folder Structure)
```
├── pom.xml
└── src
    └── main
        └── resources
            ├── ScriptModule
            ├── Workflow
            ├── PolicyTemplate
            ├── ResourceElement
            └── ConfigurationElement
```


## Flat Package (Exported Archived Package Folder Structure)
```
├── dunes-meta-inf
├── certificates
│   └── O=VMware,OU=WWPS,CN=WWCE.cer
├── elements
│   └── 00000000-0000-0000-0000-000000000000 (element ID)
│       ├── categories
│       ├── content-signature
│       ├── data
│       │   └── VSO-RESOURCE-INF (if ResourceElement the data is ZIP)
│       │       ├── attribute_allowedOperations
│       │       ├── attribute_description
│       │       ├── attribute_id
│       │       ├── attribute_mimetype
│       │       ├── attribute_name
│       │       └── attribute_version
│       ├── info
│       └── tags
└── signatures (signatures of the parent structure)
    ├── certificates
    │   └── O=VMware,OU=WWPS,CN=WWCE.cer
    ├── dunes-meta-inf
    └── elements
        └── 00000000-0000-0000-0000-000000000000
            ├── categories
            ├── content-signature
            ├── data
            ├── info
            └── tags
```

### JS Folder Structure
```
├── pom.xml
└── src
    └── main
        └── resources
            └── com
                └── company
                    └── package
                        └── actions
                            ├── ActionOne.js
                            ├── ActionTwo.js
                            └── ActionTree.js
```

# Prerequisites

## Certificates Folder Structure
```
├── certificates.PEM
├── privateKey.PEM
└── privateKeyPassphrase.TXT
```

# Operations
It can convert from any to any of the following:
 - Flat Package
 - XML Tree
 - JS Folder
