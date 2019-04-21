/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import { vmw } from "../../proto"

export default class Previewer {
    static extendDescriptionWithParams(
        description?: string | null,
        params?: vmw.pscoe.hints.IParameter[] | null
    ): string | undefined {
        if (!description) {
            return undefined
        }

        description = description.trim()

        if (params && params.length > 0) {
            description += "\n\n"
            params.forEach((param, i, list) => {
                description += `@param ${param.name} - ${param.description}\n\n`
            })
        }
        return description
    }

    static computeDetailsForAction(action: vmw.pscoe.hints.IAction): string {
        const name = action.name || ""
        const isClass = name[0] === name[0].toUpperCase()

        let result = `(v${action.version}) \n`
        result += isClass ? "class" : "function"
        result += ` ${name}(`

        if (action.parameters) {
            action.parameters.forEach((param, i, list) => {
                result += `\n　　${param.name}: ${Previewer.normalizeType(param.type)}`
                result += i < list.length - 1 ? ", " : "\n"
            })
        }

        result += `): ${Previewer.normalizeType(action.returnType, "void")}`
        return result
    }

    static computeDetailsForMethod(method: vmw.pscoe.hints.IMethod): string {
        const name = method.name || ""
        const returnType = method.returnType ? Previewer.normalizeType(method.returnType.type) : "void"
        let result = `function ${name}(`

        if (method.parameters) {
            method.parameters.forEach((param, i, list) => {
                result += `\n　　${param.name}: ${Previewer.normalizeType(param.type)}`
                result += i < list.length - 1 ? ", " : "\n"
            })
        }

        result += `): ${returnType}`
        return result
    }

    static computeDetailsForProperty(prop: vmw.pscoe.hints.IProperty): string {
        const name = prop.name || ""
        const returnType = prop.returnType ? Previewer.normalizeType(prop.returnType.type) : "Any"
        let result = prop.readOnly ? "const " : "var "
        result += `${name}: ${returnType}`

        return result
    }

    static computeDetailsForConstructor(cls: vmw.pscoe.hints.IClass, constr: vmw.pscoe.hints.IConstructor): string {
        const name = cls.name || ""
        let result = `class ${name}(`

        if (constr.parameters) {
            constr.parameters.forEach((param, i, list) => {
                result += `\n　　${param.name}: ${Previewer.normalizeType(param.type)}`
                result += i < list.length - 1 ? ", " : "\n"
            })
        }

        result += `)`
        return result
    }

    static computeDetailsForClass(cls: vmw.pscoe.hints.IClass | vmw.pscoe.hints.IFunctionSet): string {
        const name = cls.name || ""
        return `static class ${name}`
    }

    private static normalizeType(returnType?: string | null, defaultVal: string = "Any"): string {
        let result = returnType || defaultVal

        if (result[0] === "[") {
            result = `Array<${result.replace("[", "")}>`
        }

        return result
    }
}
