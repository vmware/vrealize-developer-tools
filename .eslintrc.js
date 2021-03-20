module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:prettier/recommended" // Make sure this is always the last configuration in the extends array.
    ],
    plugins: ["prettier", "@typescript-eslint", "header", "import"],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        project: "./tsconfig.eslint.json"
    },
    env: {
        node: true,
        es6: true,
        jest: true
    },
    rules: {
        "@typescript-eslint/array-type": ["error", { default: "array" }],
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                accessibility: "no-public",
                overrides: {
                    parameterProperties: "explicit"
                }
            }
        ],
        "@typescript-eslint/ban-types": [
            "error",
            {
                types: {
                    Object: {
                        message: "Avoid using the `Object` type.",
                        fixWith: "object"
                    },
                    Function: {
                        message:
                            "Avoid using the `Function` type. Prefer a specific function type, like `() => void`, or use `ts.AnyFunction`.",
                        fixWith: "() => void"
                    },
                    Boolean: {
                        message: "Avoid using the `Boolean` type. ",
                        fixWith: "boolean"
                    },
                    Number: {
                        message: "Avoid using the `Number` type.",
                        fixWith: "number"
                    },
                    String: {
                        message: "Avoid using the `String` type.",
                        fixWith: "string"
                    }
                }
            }
        ],

        "arrow-parens": ["warn", "as-needed"],
        "no-constant-condition": ["warn", { checkLoops: false }],
        "no-else-return": "warn",
        "no-empty": ["warn", { allowEmptyCatch: true }],
        "no-empty-function": ["warn", { allow: ["constructors"] }],
        "no-eval": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "error",
        "no-return-assign": "error",
        "no-sequences": "error",
        "no-template-curly-in-string": "warn",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "warn",
        "no-unneeded-ternary": "error",
        "no-use-before-define": "off",
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-with": "error",
        "prefer-const": "error",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "sort-imports": [
            "error",
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "multiple", "single"]
            }
        ],

        "import/export": "off",
        "import/named": "off",
        "import/no-unresolved": [
            "warn",
            { ignore: ["vscode", "vrealize-common", "vro-language-server", "../../proto"] }
        ],
        "import/namespace": "off",
        "import/newline-after-import": "warn",
        "import/extensions": ["error", "never"],
        "import/order": [
            "warn",
            {
                "groups": ["builtin", "external", "internal", ["index", "sibling", "parent"]],
                "newlines-between": "always"
            }
        ],

        "header/header": [
            2,
            "block",
            [
                "!",
                {
                    pattern: " * Copyright \\d{4}-\\d{4} VMware, Inc\\.",
                    template: " * Copyright 2018-2020 VMware, Inc."
                },
                " * SPDX-License-Identifier: MIT",
                " "
            ]
        ]
    }
}
