/* Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT */

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

"use strict"

const path = require("path")
const merge = require("merge-options")
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = function withDefaults(/**@type WebpackConfig*/ extConfig) {
    /** @type WebpackConfig */
    let defaultConfig = {
        mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
        target: "node",
        node: {
            __dirname: false // leave the __dirname-behaviour intact
        },
        resolve: {
            extensions: [".ts", ".js"],
            plugins: [new TsconfigPathsPlugin.TsconfigPathsPlugin()]
        },
        output: {
            path: path.join(extConfig.context, "dist"),
            filename: "[name].js",
            libraryTarget: "commonjs2",
            devtoolModuleFilenameTemplate: "../[resource-path]"
        },
        externals: {
            "vscode": "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
            "original-fs": "commonjs original-fs"
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
        },
        devtool: "nosources-source-map"
    }

    return merge(defaultConfig, extConfig)
}
