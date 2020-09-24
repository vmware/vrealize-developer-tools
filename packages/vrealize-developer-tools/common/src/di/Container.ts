/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import "reflect-metadata"

import { CircularDependencyError } from "./CircularDependencyError"
import { NotAutoWiredError } from "./NotAutoWiredError"

export type ClassConstructor<T> = new (...args: any[]) => T

export class Container {
    private instances: Map<string, any> = new Map()
    private visited: Set<string> = new Set()

    set<T>(clazz: ClassConstructor<T>, obj: T): void {
        this.instances.set(clazz.name, obj)
    }

    get<T>(clazz: ClassConstructor<T>): T {
        if (!this.instances.has(clazz.name)) {
            if (!clazz.hasOwnProperty("__autowire")) {
                throw new NotAutoWiredError(
                    "Class doesn't have property __autowire. Make sure classes are annotated with @AutoWire."
                )
            }

            if (this.visited.has(clazz.name)) {
                throw new CircularDependencyError(clazz.name, Array.from(this.visited))
            }

            this.visited.add(clazz.name)
            this.set(clazz, this.getInstance(clazz))
        }
        return this.instances.get(clazz.name)
    }

    private getInstance<T>(clazz: ClassConstructor<T>): T {
        const types = Reflect.getMetadata("design:paramtypes", clazz)
        let params = []
        if (types) {
            params = types.map((t: any) => {
                // Parameter type will be undefined when there is a circualar dependency
                if (t === undefined) {
                    throw new CircularDependencyError(clazz.name, Array.from(this.visited))
                }

                return this.get(t)
            })
        }
        return new clazz(...params)
    }
}
