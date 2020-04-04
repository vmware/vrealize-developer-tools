/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { InputBox, QuickInputButton, QuickPick, QuickPickItem } from "vscode"
import { Logger } from "vrealize-common"

export class BreakMultiStep extends Error {
    constructor() {
        super("break")
    }
}

export enum Directive {
    Back = "Back",
    Cancel = "Cancel"
}

export interface QuickInputStep {
    additionalButtons?: QuickInputButton[]
    buttons?: QuickInputButton[]
    placeholder?: string
    title?: string
    maskChars?: boolean
    value?: string

    onDidClickButton?(input: InputBox, button: QuickInputButton): void
    validate?(value: string | undefined): [boolean, string | undefined] | Promise<[boolean, string | undefined]>

    shouldSkip?<T>(state: StepState<T>): boolean | Promise<boolean>
    complete?<T>(state: StepState<T>, selection: string): void | Promise<void>
}

export function isQuickInputStep(item: QuickPickStep | QuickInputStep): item is QuickInputStep {
    return (item as QuickPickStep).items === undefined
}

export interface QuickPickStep<T extends QuickPickItem = any> {
    additionalButtons?: QuickInputButton[]
    buttons?: QuickInputButton[]
    items: T[] | Promise<T[]>
    matchOnDescription?: boolean
    matchOnDetail?: boolean
    multiselect?: boolean
    placeholder?: string
    selectedItems?: T[]
    title?: string
    value?: string

    onDidAccept?(quickpick: QuickPick<T>): boolean | Promise<boolean>
    onDidChangeValue?(quickpick: QuickPick<T>): boolean | Promise<boolean>
    onDidClickButton?(quickpick: QuickPick<T>, button: QuickInputButton): void
    validate?(selection: T[]): boolean

    shouldSkip?<S>(state: StepState<S>): boolean | Promise<boolean>
    complete?<S>(state: StepState<S>, selection: T[]): void | Promise<void>
}

export function isQuickPickStep(item: QuickPickStep | QuickInputStep): item is QuickPickStep {
    return (item as QuickPickStep).items !== undefined
}

export type StepAsyncGenerator = AsyncGenerator<QuickPickStep | QuickInputStep, undefined, any | undefined>
type StepItemType<T> = T extends QuickPickStep<infer U> ? U[] : T extends QuickInputStep ? string : never
export type StepSelection<T> = StepItemType<T> | Directive
export type StepState<T> = Partial<T>

export class MultiStepMachine<TState = any> {
    protected readonly logger: Logger = Logger.get("MultiStepMachine")

    private _current: QuickPickStep | QuickInputStep | undefined
    private _stepsIterator: StepAsyncGenerator

    constructor(
        protected readonly steps: (QuickPickStep | QuickInputStep)[],
        public readonly state: StepState<TState> = {}
    ) {
        this._stepsIterator = this.stepsIterator()
    }

    protected async *stepsIterator(): StepAsyncGenerator {
        const steps = this.steps
        let counter: number = 0
        let wentBack: boolean = false
        let hitTheBottom: boolean = false
        let step: QuickPickStep | QuickInputStep

        while (true) {
            if (counter >= steps.length) break
            if (counter < 0) {
                counter = 0
                hitTheBottom = true
                wentBack = false
            }

            step = steps[counter]

            try {
                const shouldSkip = !hitTheBottom && (await step.shouldSkip?.(this.state))

                if (hitTheBottom) {
                    hitTheBottom = false
                }

                if (shouldSkip && !wentBack) {
                    counter++
                    wentBack = false
                    continue
                } else if (shouldSkip && wentBack) {
                    // go back again
                    counter--
                    wentBack = true
                    continue
                }

                if (isQuickPickStep(step)) {
                    step = this.createPickStep(step)
                } else if (isQuickInputStep(step)) {
                    step = this.createInputStep(step)
                } else {
                    break
                }

                const selection: StepSelection<typeof step> = yield step

                if (selection === undefined || selection === Directive.Cancel) {
                    break
                }

                if (selection === Directive.Back) {
                    counter--
                    wentBack = true
                    continue
                }

                if (isQuickPickStep(step) && typeof selection !== "string") {
                    if (step.validate === undefined || step.validate(selection)) {
                        await step.complete?.(this.state, selection)
                        counter++
                    }
                } else if (isQuickInputStep(step) && typeof selection === "string") {
                    if (step.validate === undefined || (await step.validate(selection))) {
                        await step.complete?.(this.state, selection)
                        counter++
                    }
                }
            } catch (ex) {
                if (ex instanceof BreakMultiStep) break
                this.logger.error(ex)
                throw ex
            }
        }

        return undefined
    }

    async previous(): Promise<QuickPickStep | QuickInputStep | undefined> {
        return (await this.next(Directive.Back)).value
    }

    async next(value?: StepSelection<any>): Promise<IteratorResult<QuickPickStep | QuickInputStep>> {
        const result = await this._stepsIterator.next(value)
        this._current = result.value
        return result
    }

    get value(): QuickPickStep | QuickInputStep | undefined {
        return this._current
    }

    protected createInputStep(step: QuickInputStep): QuickInputStep {
        return step
    }

    protected createPickStep<T extends QuickPickItem>(step: QuickPickStep<T>): QuickPickStep<T> {
        return step
    }
}
