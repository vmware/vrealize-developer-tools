/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as vscode from "vscode"

import {
    isQuickInputStep,
    isQuickPickStep,
    MultiStepMachine,
    QuickInputStep,
    QuickPickStep,
    StepNode,
    StepSelection,
    StepState
} from "./MultiStepMachine"
import { ConfigurationManager } from "../system"

export class ToggleQuickInputButton implements vscode.QuickInputButton {
    constructor(
        private _context: vscode.ExtensionContext,
        private _off: { icon: string; tooltip: string },
        private _on: { icon: string; tooltip: string },
        private _toggled = false
    ) {
        this._iconPath = this.getIconPath()
    }

    private _iconPath: { light: vscode.Uri; dark: vscode.Uri }
    get iconPath(): { light: vscode.Uri; dark: vscode.Uri } {
        return this._iconPath
    }

    get tooltip(): string {
        return this._toggled ? this._on.tooltip : this._off.tooltip
    }

    get on() {
        return this._toggled
    }
    set on(value: boolean) {
        this._toggled = value
        this._iconPath = this.getIconPath()
    }

    private getIconPath() {
        return {
            dark: vscode.Uri.file(
                this._context.asAbsolutePath(`assets/icons/dark/${this.on ? this._on.icon : this._off.icon}.svg`)
            ),
            light: vscode.Uri.file(
                this._context.asAbsolutePath(`assets/icons/light/${this.on ? this._on.icon : this._off.icon}.svg`)
            )
        }
    }
}

export interface IdentityQuickPickItem extends vscode.QuickPickItem {
    id: string
    name: string
}

const Buttons = class {
    static readonly Pinned = class extends ToggleQuickInputButton {
        constructor(context: vscode.ExtensionContext, on = false) {
            super(context, { tooltip: "Not Pinned", icon: "pin" }, { tooltip: "Pinned", icon: "pin-selected" }, on)
        }
    }
}

export class MultiStepInput<TState> {
    constructor(
        public readonly title: string,
        private context: vscode.ExtensionContext,
        private config: ConfigurationManager
    ) {
        // empty
    }

    async run(
        rootStep: StepNode<QuickPickStep | QuickInputStep>,
        state: TState
    ): Promise<StepState<TState> | undefined> {
        if (!rootStep || !rootStep.value) {
            return
        }

        // used to hide certain buttons on the first step, like 'back'
        rootStep.value["isHead"] = true

        const stepMachine = new MultiStepMachine<TState>(rootStep, state)
        let step: QuickPickStep | QuickInputStep | undefined = undefined

        const next = await stepMachine.next()
        if (next.done) return
        step = next.value

        while (step !== undefined) {
            if (isQuickPickStep(step)) {
                step = await this.showPickStep(step, stepMachine)
                continue
            }

            if (isQuickInputStep(step)) {
                step = await this.showInputStep(step, stepMachine)
                continue
            }

            break
        }

        return stepMachine.state
    }

    private async showInputStep(step: QuickInputStep, stepMachine: MultiStepMachine) {
        const input = vscode.window.createInputBox()
        input.ignoreFocusOut = this.config.vrdev.commandPalette.multiStep.pinned

        const disposables: vscode.Disposable[] = []

        try {
            return await new Promise<QuickPickStep | QuickInputStep | undefined>(resolve => {
                disposables.push(
                    input.onDidHide(() => resolve(undefined)),
                    input.onDidTriggerButton(async button => {
                        if (button === vscode.QuickInputButtons.Back) {
                            resolve(await this.goBack(input, stepMachine))
                            return
                        }

                        if (button instanceof Buttons.Pinned) {
                            await this.togglePinned(step, input)
                            return
                        }

                        if (step.onDidClickButton !== undefined) {
                            step.onDidClickButton(input, button)
                            input.buttons = this.getButtons(step)
                        }
                    }),
                    input.onDidChangeValue(async e => {
                        if (step.validate === undefined) return

                        const [, message] = await step.validate(e)
                        input.validationMessage = message
                    }),
                    input.onDidAccept(async () => {
                        const value = input.value
                        input.enabled = false
                        input.busy = true

                        const [isValid, message] =
                            step.validate === undefined ? [true, undefined] : await step.validate(value)

                        if (isValid) {
                            resolve(await this.goNext(input, stepMachine, input.value))
                        }

                        input.validationMessage = message
                        input.enabled = true
                        input.busy = false
                    })
                )

                input.buttons = this.getButtons(step)
                input.title = step.title
                input.password = step.maskChars ?? false
                input.placeholder = step.placeholder
                input.prompt = step.prompt
                if (step.value !== undefined) {
                    input.value = step.value
                }

                input.show()

                // Manually trigger `onDidChangeValue`, because the InputBox seems to fail to call it properly
                if (step.value !== undefined) {
                    ;(input as any)._onDidChangeValueEmitter.fire(input.value)
                }
            })
        } finally {
            input.dispose()
            disposables.forEach(d => d.dispose())
        }
    }

    private async showPickStep(step: QuickPickStep, stepMachine: MultiStepMachine) {
        const quickpick = vscode.window.createQuickPick()
        quickpick.ignoreFocusOut = this.config.vrdev.commandPalette.multiStep.pinned

        const disposables: vscode.Disposable[] = []

        try {
            return await new Promise<QuickPickStep | QuickInputStep | undefined>(async resolve => {
                disposables.push(
                    quickpick.onDidHide(() => resolve(undefined)),
                    quickpick.onDidTriggerButton(async button => {
                        if (button === vscode.QuickInputButtons.Back) {
                            resolve(await this.goBack(quickpick, stepMachine))
                            return
                        }

                        if (button instanceof Buttons.Pinned) {
                            await this.togglePinned(step, quickpick)
                            return
                        }

                        if (step.onDidClickButton !== undefined) {
                            step.onDidClickButton(quickpick, button)
                            quickpick.buttons = this.getButtons(step)
                        }
                    }),
                    quickpick.onDidChangeValue(async e => {
                        if (step.onDidChangeValue !== undefined) {
                            const cancel = await step.onDidChangeValue(quickpick)
                            if (cancel) return
                        }

                        if (quickpick.canSelectMany && e === " ") {
                            quickpick.value = ""
                            quickpick.selectedItems =
                                quickpick.selectedItems.length === quickpick.items.length ? [] : quickpick.items
                        }
                    }),
                    quickpick.onDidChangeActive(() => {
                        if (quickpick.activeItems.length === 0) return

                        quickpick.buttons = this.getButtons(step)
                    }),
                    quickpick.onDidAccept(async () => {
                        let items = quickpick.selectedItems
                        if (items.length === 0) {
                            if (!quickpick.canSelectMany || quickpick.activeItems.length === 0) {
                                const value = quickpick.value.trim()
                                if (value.length === 0) return

                                if (step.onDidAccept === undefined) return

                                quickpick.busy = true

                                if (await step.onDidAccept(quickpick)) {
                                    resolve(await this.goNext(quickpick, stepMachine, value))
                                }

                                quickpick.busy = false
                                return
                            }

                            items = quickpick.activeItems
                        }

                        if (!quickpick.canSelectMany) {
                            if (step.onDidAccept !== undefined) {
                                quickpick.busy = true

                                const next = await step.onDidAccept(quickpick)

                                quickpick.busy = false

                                if (!next) {
                                    return
                                }
                            }
                        }

                        resolve(await this.goNext(quickpick, stepMachine, items as vscode.QuickPickItem[]))
                    })
                )

                quickpick.title = step.title
                quickpick.placeholder = step.placeholder
                quickpick.matchOnDescription = Boolean(step.matchOnDescription)
                quickpick.matchOnDetail = Boolean(step.matchOnDetail)
                quickpick.canSelectMany = Boolean(step.multiselect)
                quickpick.buttons = this.getButtons(step)

                quickpick.show()
                quickpick.busy = true

                quickpick.items = await Promise.resolve(step.items)

                if (quickpick.canSelectMany) {
                    quickpick.selectedItems = step.selectedItems || quickpick.items.filter(i => i.picked)
                    quickpick.activeItems = quickpick.selectedItems
                } else {
                    quickpick.activeItems = step.selectedItems || quickpick.items.filter(i => i.picked)
                }

                if (step.value !== undefined) {
                    quickpick.value = step.value
                }

                quickpick.busy = false

                // Manually trigger `onDidChangeValue`, because the QuickPick seems to fail to call it properly
                if (step.value !== undefined) {
                    ;(quickpick as any)._onDidChangeValueEmitter.fire(quickpick.value)
                }
            })
        } finally {
            quickpick.dispose()
            disposables.forEach(d => d.dispose())
        }
    }

    private getButtons(step: QuickInputStep | QuickPickStep | undefined) {
        const buttons: vscode.QuickInputButton[] = []
        const pinned = this.config.vrdev.commandPalette.multiStep.pinned

        if (step !== undefined) {
            if (step.buttons !== undefined) {
                buttons.push(...step.buttons, new Buttons.Pinned(this.context, pinned))
                return buttons
            }

            if (!step["isHead"]) {
                buttons.push(vscode.QuickInputButtons.Back)
            }

            if (step.additionalButtons !== undefined) {
                buttons.push(...step.additionalButtons)
            }
        }

        buttons.push(new Buttons.Pinned(this.context, pinned))

        return buttons
    }

    private async goNext(
        input: vscode.InputBox | vscode.QuickPick<vscode.QuickPickItem>,
        stepMachine: MultiStepMachine,
        value: StepSelection<any> | undefined
    ) {
        input.busy = true
        input.enabled = false

        const next = await stepMachine.next(value)
        if (next.done) return undefined

        input.value = ""
        return next.value
    }

    private async goBack(
        input: vscode.InputBox | vscode.QuickPick<vscode.QuickPickItem>,
        stepMachine: MultiStepMachine
    ) {
        input.value = ""
        input.busy = true
        return stepMachine.previous()
    }

    private async togglePinned(
        step: QuickInputStep | QuickPickStep | undefined,
        input: vscode.InputBox | vscode.QuickPick<vscode.QuickPickItem>
    ) {
        const pinned = !this.config.vrdev.commandPalette.multiStep.pinned

        input.ignoreFocusOut = pinned

        await vscode.workspace
            .getConfiguration("vrdev.commandPalette.multiStep")
            .update("pinned", pinned, vscode.ConfigurationTarget.Global)

        input.buttons = this.getButtons(step)
    }
}
