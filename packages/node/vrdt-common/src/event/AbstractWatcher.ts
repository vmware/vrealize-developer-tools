/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { default as Logger } from "../logger"

export type ChangeListener<Event> = (event: Event) => void

export abstract class AbstractWatcher<Event> {
    protected abstract readonly logger: Logger
    private listeners: ChangeListener<Event>[] = []

    protected notifyListeners(event: Event): void {
        this.listeners.forEach(listener => {
            listener(event)
        })
    }

    protected registerListener(listener: ChangeListener<Event>): { dispose(): any } {
        this.listeners.push(listener)

        return {
            dispose: () => this.listeners.splice(this.listeners.indexOf(listener), 1)
        }
    }
}
