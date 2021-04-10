/* Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT */
//@ts-check

"use strict"

const path = require("path")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

/**@type {import('webpack').Configuration}*/
const config = {
    target: "node",

    entry: {
        extension: "./extension/src/extension.ts",
        langserver: "./packages/node/vro-language-server/src/server/langserver.ts"
    },

    output: {
        // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]"
    },
    devtool: "source-map",
    externals: {
        "vscode": "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
        "original-fs": "commonjs original-fs"
    },
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [
            new TsconfigPathsPlugin.TsconfigPathsPlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /.node$/,
                loader: "node-loader"
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            projectReferences: true,
                            compilerOptions: {
                                module: "es6" // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
                            }
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = config
