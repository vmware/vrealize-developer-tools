/*!
 * Copyright 2018-2019 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */

import * as _ from "lodash"
import { AutoWire, Logger, WorkspaceFolder } from "vrealize-common"
import {
    CancellationToken,
    CompletionItem,
    CompletionItemKind,
    Position,
    TextDocumentPositionParams
} from "vscode-languageserver"
import { URI } from "vscode-uri"

import { ConnectionLocator, Environment, HintLookup } from "../core"
import { Synchronizer, TextDocumentWrapper } from "../document"
import { Previewer } from "../util"

enum CompletionPrefixKind {
    UNKNOWN = "Unknown",
    CLASS_IMPORT = "Class Import",
    CLASS_REFERENCE = "Class Reference",
    STATIC_MEMBER_REFERENCE = "Static Member Reference",
    NEW_INSTANCE = "New Instance",
    MODULE_IMPORT = "Module Import"
}

interface CompletionPrefix {
    readonly value: string
    readonly kind: CompletionPrefixKind
    readonly filter: string
}

class CompletionPrefixPattern {
    private readonly patterns: RegExp[]

    constructor(public readonly kind: CompletionPrefixKind, ...patterns: RegExp[]) {
        this.patterns = patterns
    }

    match(content: string): CompletionPrefix | null {
        for (const pattern of this.patterns) {
            const matchGroups = pattern.exec(content)
            if (matchGroups) {
                return { value: matchGroups[1], filter: matchGroups[2], kind: this.kind }
            }
        }

        return null
    }
}
const prefixPatterns = [
    new CompletionPrefixPattern(
        CompletionPrefixKind.MODULE_IMPORT,
        /System\.getModule\s*\(["']((?:[a-zA-Z_$][\w$]*\.)*)([a-zA-Z_$]?[\w$]*)$/, // https://regex101.com/r/bsVfwk/1
        /Class\.load\s*\(["']((?:[a-zA-Z_$][\w$]*\.)*)([a-zA-Z_$]?[\w$]*)$/ // https://regex101.com/r/90B9Db/1
    ),

    new CompletionPrefixPattern(
        CompletionPrefixKind.CLASS_IMPORT,
        /System\.getModule\s*\(["']([\w$.]+)["']\)\.([\w$]*)$/, // https://regex101.com/r/AxLdXu/1
        /Class\.load\s*\(["']([\w$.]+)["']\s*,\s*["']([\w$]*)["']?$/ // https://regex101.com/r/jQ4ejs/3
    ),

    new CompletionPrefixPattern(
        CompletionPrefixKind.NEW_INSTANCE, // https://regex101.com/r/J1Tf0n/1
        /new\s+([a-zA-Z_$]?[\w$]*)$/
    ),

    new CompletionPrefixPattern(
        CompletionPrefixKind.CLASS_REFERENCE, // https://regex101.com/r/xnXL8G/2
        /(?:return|[=([,!+:]|(?:^\s*))\s*([a-zA-Z_$]?[\w$]*)$/
    ),

    new CompletionPrefixPattern(
        CompletionPrefixKind.STATIC_MEMBER_REFERENCE, // https://regex101.com/r/6R1L3m/1
        /([a-zA-Z_$][\w$]*)\.([a-zA-Z_$]?[\w$]*)$/
    ),

    new CompletionPrefixPattern(
        CompletionPrefixKind.UNKNOWN, // https://regex101.com/r/yvhXsX/3
        /((?:[a-zA-Z_$][\w$]*\.)*)([a-zA-Z_$]?[\w$]*)$/
    )
]

@AutoWire
export class CompletionProvider {
    private readonly logger = Logger.get("CompletionProvider")

    constructor(
        private synchronizer: Synchronizer,
        private hints: HintLookup,
        private environment: Environment,
        connectionLocator: ConnectionLocator
    ) {
        connectionLocator.connection.onCompletion(this.complete.bind(this))
    }

    async complete(event: TextDocumentPositionParams, token: CancellationToken) {
        const document = this.synchronizer.getTextDocument(event.textDocument.uri)
        if (!document) return []

        if (token.isCancellationRequested) {
            this.logger.info("Auto completion request was cancelled")
            return []
        }

        const prefix: CompletionPrefix | null = this.getPrefix(document, event.position)
        if (!prefix) return []

        const workspaceFolder = this.environment.getWorkspaceFolderOf(URI.parse(event.textDocument.uri).fsPath)

        switch (prefix.kind) {
            case CompletionPrefixKind.MODULE_IMPORT:
                return workspaceFolder ? this.getModuleSuggestions(prefix, workspaceFolder) : []
            case CompletionPrefixKind.CLASS_IMPORT:
                return workspaceFolder ? this.getModuleClassSuggestions(prefix, workspaceFolder) : []
            case CompletionPrefixKind.NEW_INSTANCE:
                return this.getConstructorSuggestions(prefix)
            case CompletionPrefixKind.CLASS_REFERENCE:
                return this.getClassReferenceSuggestions(prefix)
            case CompletionPrefixKind.STATIC_MEMBER_REFERENCE:
                return this.getStaticMemberSuggestions(prefix)
            default:
                return []
        }
    }

    private getModuleSuggestions(prefix: CompletionPrefix, workspaceFolder: WorkspaceFolder): CompletionItem[] {
        let suggestions = this.hints
            .getActionModules(workspaceFolder)
            .filter(item => !!item && !!item.name && item.name.startsWith(prefix.value))
            .map(item => {
                let name = item.name || "(no-name)"
                name = name.replace(prefix.value, "")

                if (name.startsWith(".")) {
                    name = name.replace(".", "")
                }

                return name
            })
            .filter(name => name.startsWith(prefix.filter))
            .map(label => {
                const dotIdx = label.indexOf(".")
                if (dotIdx > -1) {
                    label = label.substring(0, label.indexOf("."))
                }

                return label
            })

        suggestions = _.uniq(suggestions)

        return suggestions.map(label => {
            const completionItem = CompletionItem.create(label)
            completionItem.kind = CompletionItemKind.Module
            return completionItem
        })
    }

    private getClassReferenceSuggestions(prefix: CompletionPrefix): CompletionItem[] {
        const suggestions =
            // TODO: Set isInstantiable back to `false`, once there are other ways to find out
            // the members of non-static classes. At the moment, the only way to do that
            // is to reference the class directly and check its members using the auto-complete feature
            this.hints
                .getClasses({ isInstantiable: undefined })
                .concat(this.hints.getFunctionSets())
                .filter(cls => !!cls.name && cls.name.startsWith(prefix.filter || ""))
                .map(cls => {
                    const name = cls.name || ""
                    const completionItem = CompletionItem.create(name)
                    completionItem.kind = CompletionItemKind.Class
                    completionItem.documentation = cls.description ? cls.description.trim() : undefined
                    completionItem.detail = Previewer.computeDetailsForClass(cls)
                    completionItem.sortText = `000${name}`
                    return completionItem
                })

        return suggestions
    }

    private getStaticMemberSuggestions(prefix: CompletionPrefix): CompletionItem[] {
        // TODO: Set isInstantiable back to `false`, once there are other ways to find out
        // the members of non-static classes. At the moment, the only way to do that
        // is to reference the class directly and check its members using the auto-complete feature
        const cls = this.hints
            .getClasses({ isInstantiable: undefined })
            .concat(this.hints.getFunctionSets())
            .find(c => c.name === prefix.value)

        if (!cls) return []

        const suggestions: CompletionItem[] = []

        if (cls.methods && cls.methods.length > 0) {
            cls.methods
                .filter(method => !!method.name && method.name.startsWith(prefix.filter || ""))
                .forEach(method => {
                    const name = method.name || ""
                    const completionItem = CompletionItem.create(name)
                    completionItem.kind = CompletionItemKind.Method
                    completionItem.documentation = Previewer.extendDescriptionWithParams(
                        method.description,
                        method.parameters
                    )
                    completionItem.detail = Previewer.computeDetailsForMethod(method)
                    completionItem.sortText = `000${name}`
                    suggestions.push(completionItem)
                })
        }

        if (cls.properties && cls.properties.length > 0) {
            cls.properties
                .filter(prop => !!prop.name && prop.name.startsWith(prefix.filter || ""))
                .forEach(prop => {
                    const name = prop.name || ""
                    const completionItem = CompletionItem.create(name)
                    completionItem.kind = CompletionItemKind.Variable

                    if (prop.readOnly) {
                        completionItem.kind =
                            name.toUpperCase() === name ? CompletionItemKind.Enum : CompletionItemKind.Value
                    }

                    completionItem.documentation = prop.description ? prop.description.trim() : undefined
                    completionItem.detail = Previewer.computeDetailsForProperty(prop)
                    completionItem.sortText = `000${name}`
                    suggestions.push(completionItem)
                })
        }

        return suggestions
    }

    private getConstructorSuggestions(prefix: CompletionPrefix): CompletionItem[] {
        const suggestions: CompletionItem[] = []

        this.hints
            .getClasses({ isInstantiable: true })
            .filter(cls => !!cls.name && cls.name.startsWith(prefix.filter || ""))
            .forEach(cls => {
                if (cls.constructors && cls.constructors.length > 0) {
                    for (const constr of cls.constructors) {
                        const name = cls.name || ""
                        const completionItem = CompletionItem.create(name)
                        completionItem.kind = CompletionItemKind.Constructor

                        if (constr.description) {
                            completionItem.documentation = Previewer.extendDescriptionWithParams(
                                constr.description,
                                constr.parameters
                            )
                        } else if (cls.description) {
                            completionItem.documentation = cls.description
                        }

                        completionItem.detail = Previewer.computeDetailsForConstructor(cls, constr)
                        completionItem.sortText = `000${name}`
                        suggestions.push(completionItem)
                    }
                }
            })

        return suggestions
    }

    private getModuleClassSuggestions(prefix: CompletionPrefix, workspaceFolder: WorkspaceFolder): CompletionItem[] {
        const suggestions = this.hints
            .getActionsIn(prefix.value, workspaceFolder)
            .filter(a => !!a.name && a.name.startsWith(prefix.filter || ""))
            .map(action => {
                const name = action.name || ""
                const completionItem = CompletionItem.create(name)
                const isClass = name[0] === name[0].toUpperCase()
                completionItem.kind = isClass ? CompletionItemKind.Class : CompletionItemKind.Function
                completionItem.documentation = Previewer.extendDescriptionWithParams(
                    action.description,
                    action.parameters
                )
                completionItem.detail = Previewer.computeDetailsForAction(action)
                completionItem.sortText = `000${name}`
                return completionItem
            })

        return suggestions
    }

    private getPrefix(document: TextDocumentWrapper, position: Position): CompletionPrefix | null {
        const lineContent = document.getLineContentUntil(position)

        this.logger.debug(`Trying to provide auto completion for line '${lineContent}'`)

        for (const pattern of prefixPatterns) {
            const prefix = pattern.match(lineContent)
            if (prefix) {
                this.logger.debug(`Matched '${prefix.kind}' pattern`)
                return prefix
            }
        }

        this.logger.debug("None of the patterns matched.")
        return null
    }
}
