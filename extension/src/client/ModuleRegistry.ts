/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { di, Logger } from "vrealize-common"
import * as vscode from "vscode"

import { ClientWindow } from "./ui"
import { Registrable } from "./Registrable"

type Constructable<T> = new () => T

export class ModuleRegistry {
    private readonly container: di.Container
    private readonly logger = Logger.get("ModuleRegistry")

    constructor(private context: vscode.ExtensionContext, private clientWindow: ClientWindow) {
        this.container = new di.Container()
    }

    private registerModule(mod: any) {
        for (const entry of Object.entries(mod)) {
            const clsName = entry[0]
            const cls = entry[1] as Constructable<any>
            let clsInstance

            if (cls.hasOwnProperty("__autowire")) {
                try {
                    this.logger.debug(`Registering class ${clsName}`)
                    clsInstance = this.container.get(cls)
                } catch (e) {
                    if (e.message.indexOf("__autowire") < 0) {
                        this.logger.debug(`Caught error: ${e} for class:  ${clsName}`)
                        this.logger.debug(`Visited classes: ${e.visited}`)
                        this.logger.error(e.stack)
                        throw e
                    }
                }
            }

            if (!clsInstance) {
                clsInstance = new cls()
            }

            if (this.isRegistrable(clsInstance)) {
                clsInstance.register(this.context, this.clientWindow)
            }
        }
    }

    registerModules(...modules: any[]) {
        for (const module of modules) {
            this.registerModule(module)
        }
    }

    get<T>(clazz: di.ClassConstructor<T>): T {
        return this.container.get(clazz)
    }

    private isRegistrable(cls: any): cls is Registrable {
        return (cls as Registrable).register !== undefined
    }
}
