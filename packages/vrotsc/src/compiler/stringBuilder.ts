/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
namespace vrotsc {
    export function createStringBuilder(newLine: string = "\n", indentToken: string = "\t"): StringBuilder {
        let content = "";
        let indentLevel = 0;
        let needIndentation = false;

        const stringBuilder: StringBuilder = {
            indent,
            unindent,
            append,
            appendLine,
            toString,
        };

        return stringBuilder;

        function indent(): StringBuilder {
            indentLevel++;
            needIndentation = true;
            return stringBuilder;
        }

        function unindent(): StringBuilder {
            indentLevel--;
            needIndentation = true;
            return stringBuilder;
        }

        function append(value: string): StringBuilder {
            applyIndent();
            content += value;
            return stringBuilder;
        }

        function appendLine(): StringBuilder {
            content += newLine;
            needIndentation = true;
            return stringBuilder;
        }

        function toString(): string {
            return content;
        }

        function applyIndent(): void {
            if (needIndentation) {
                for (let i = 0; i < indentLevel; i++) {
                    content += indentToken;
                }
                needIndentation = false;
            }
        }
    }
}