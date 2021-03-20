/*!
 * Copyright 2018-2021 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { Logger } from "vrdt-common"
import * as vscode from "vscode"

import { ConfigurationManager } from "../system"
import { MultiStepInput } from "../ui/MultiStepInput"
import { QuickInputStep, QuickPickStep, StepNode, StepState } from "../ui/MultiStepMachine"

interface BlueprintInputState {
    done: boolean
    inputs: any
}

interface InputParametersMap {
    [key: string]: InputParameter
}

interface InputParameter {
    type: "string" | "number" | "integer" | "boolean" | "array" | "object"
    default?: string
    title?: string
    description?: string
    encrypted?: boolean
    writeOnly?: boolean

    enum?: string[]
    oneOf?: { title: string; const: string }[]
    //items: (string | boolean | number)[]

    pattern?: string
    minItems?: number
    maxItems?: number
    maxLength?: number
    minLength?: number
    maximum?: number
    minimum?: number
}

export class BlueprintInputsMultiStep {
    private readonly logger = Logger.get("BlueprintInputsMultiStep")

    constructor(
        public readonly deploymentName: string,
        private context: vscode.ExtensionContext,
        private config: ConfigurationManager
    ) {
        // empty
    }

    async run(inputDefinition: InputParametersMap): Promise<BlueprintInputState | undefined> {
        this.logger.info("Opening multi-step view for collecting blueprint inputs")

        const title = `Input for '${this.deploymentName}' • `
        const multiStep = new MultiStepInput(title, this.context, this.config)
        const state = { done: false, inputs: {} } as BlueprintInputState
        await multiStep.run(this.buildStepTree(title, inputDefinition), state)

        if (!state.done) {
            this.logger.info("Multi-step input was canceled")
            return undefined
        }

        return state.inputs
    }

    private buildStepTree(
        title: string,
        inputDefinition: InputParametersMap
    ): StepNode<QuickInputStep | QuickPickStep> {
        const steps = Object.entries(inputDefinition).map((definition, index, all) => {
            const [paramName, paramInfo] = definition

            if (paramInfo.type === "array" || paramInfo.type === "object") {
                throw new Error(`Unsupported parameter type: ${paramInfo.type}`)
            }

            const step =
                paramInfo.type == "boolean" || !!paramInfo.enum || !!paramInfo.oneOf
                    ? new ParameterPickStep(title, paramName, paramInfo, index + 1, all.length)
                    : new ParameterInputStep(title, paramName, paramInfo, index + 1, all.length)

            return step
        })

        const rootNode: StepNode<QuickInputStep | QuickPickStep> = {
            value: steps[0],
            next: () => undefined
        }

        steps.reduce((prevNode, step) => {
            const thisNode = {
                value: step,
                parent: prevNode,
                next: () => undefined
            }

            prevNode.next = () => thisNode
            return thisNode
        }, rootNode)

        return rootNode
    }
}

class ParameterInputStep implements QuickInputStep {
    value: string | undefined = undefined

    constructor(
        private titlePrefix: string,
        private paramName: string,
        private paramInfo: InputParameter,
        private index: number,
        private total: number
    ) {
        this.value = this.paramInfo.default ? `${this.paramInfo.default}` : undefined
    }

    get placeholder(): string | undefined {
        return this.paramInfo.title
    }

    get prompt(): string | undefined {
        return this.paramInfo.description
    }

    get title(): string {
        return `${this.titlePrefix}${this.paramName} (${this.index}/${this.total})`
    }

    get maskChars(): boolean {
        return this.paramInfo.encrypted === true || this.paramInfo.writeOnly === true
    }

    validate(value: string | undefined): [boolean, string | undefined] {
        if (!value) {
            return [true, undefined]
        }

        if (this.paramInfo.type === "integer" || this.paramInfo.type === "number") {
            const numericValue = +value

            if (Number.isNaN(numericValue)) {
                return [false, "The specified value is not numeric"]
            }

            if (this.paramInfo.type === "integer" && numericValue % 1 != 0) {
                return [false, "The specified value is not an integer"]
            }

            const { minimum, maximum } = this.paramInfo

            if (minimum !== undefined && minimum !== null && numericValue < minimum) {
                return [false, `The specified value cannot be lower than ${maximum}`]
            }

            if (maximum !== undefined && maximum !== null && numericValue > maximum) {
                return [false, `The specified value cannot be greater than ${maximum}`]
            }
        } else if (this.paramInfo.type === "string") {
            const { minLength, maxLength, pattern } = this.paramInfo

            if (minLength !== undefined && minLength !== null && value.length < minLength) {
                return [
                    false,
                    `The specified value cannot be less than ${minLength} characters. Current length: ${value.length}`
                ]
            }

            if (maxLength !== undefined && maxLength !== null && value.length > maxLength) {
                return [
                    false,
                    `The specified value cannot be more than ${maxLength} characters. Current length: ${value.length}`
                ]
            }

            if (!!pattern && !new RegExp(pattern).test(value)) {
                return [false, `The specified value does not match against the expression ${pattern}`]
            }
        } else {
            throw new Error(`Cannot validate input parameter of type ${this.paramInfo.type}`)
        }

        return [true, undefined]
    }

    async updateState(state: StepState<BlueprintInputState>, selection: string): Promise<void> {
        if (selection === null || selection === undefined) {
            return
        }

        if (this.paramInfo.type === "integer") {
            state.inputs[this.paramName] = parseInt(selection)
        } else if (this.paramInfo.type === "number") {
            state.inputs[this.paramName] = parseFloat(selection)
        } else {
            // string
            state.inputs[this.paramName] = selection
        }

        this.value = selection

        if (this.index === this.total) {
            state.done = true
        }
    }
}

class ParameterPickStep implements QuickPickStep {
    matchOnDescription: boolean = false
    matchOnDetail: boolean = false
    multiselect: boolean = false
    selectedItems?: vscode.QuickPickItem[] = undefined

    constructor(
        private titlePrefix: string,
        private paramName: string,
        private paramInfo: InputParameter,
        private index: number,
        private total: number
    ) {
        // empty
    }

    get placeholder(): string | undefined {
        const { title, description } = this.paramInfo

        if (!!title && !!description) {
            return `${title} - ${description}`
        } else if (!!title && !description) {
            return title
        } else if (!title && !!description) {
            return description
        }

        return undefined
    }

    get title(): string {
        return `${this.titlePrefix}${this.paramName} (${this.index}/${this.total})`
    }

    get items(): vscode.QuickPickItem[] {
        let items: vscode.QuickPickItem[] = []

        if (!!this.paramInfo.enum && this.paramInfo.enum.length > 0) {
            items = this.paramInfo.enum.map(val => {
                return { label: val, description: val }
            })
        } else if (!!this.paramInfo.oneOf && this.paramInfo.oneOf.length > 0) {
            items = this.paramInfo.oneOf.map(val => {
                return { label: val.title, description: val.const }
            })
        } else if (this.paramInfo.type === "boolean") {
            items = [
                { label: "Yes", description: "true" },
                { label: "No", description: "false" }
            ]
        }

        return items
    }

    shouldSkip(state: StepState<BlueprintInputState>): boolean {
        return false
    }

    async updateState(state: StepState<BlueprintInputState>, selection: vscode.QuickPickItem[]): Promise<void> {
        if (selection === null || selection === undefined) {
            return
        }

        state.inputs[this.paramName] = selection[0].description

        if (this.index === this.total) {
            state.done = true
        }
    }
}
