/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import {userInfo} from "os";
import * as path from "path";

import * as fs from "fs-extra";
import * as xmldoc from "xmldoc";
import * as CRC from "crc-32";

import { decode } from "../encoding";
import * as t from "../types";
import { exist } from "../util";


export const read = (file) => decode(fs.readFileSync(file));
export const xml = (data) => new xmldoc.XmlDocument(data);
export const xmlGet = (doc, key): string => (doc.childWithAttribute("key", key) || {}).val;
export const xmlChildNamed = (doc, name) : string => doc.childNamed(name)?.val || "";
export const xmlToCategory = (categories): string[] => categories.children.map((e: xmldoc.XmlElement) => e.attr.name);
export const xmlToTag = (tags): string[] => tags.children.filter(e=>e.attr && e.attr.name).map((e: xmldoc.XmlElement) => e.attr.name);
export const stringToCategory = (category): string[] => category.split(/(?<!\/)\./).map(path => { return path.replace(/\//g, "") });

export const xmlToAction = (file : string, bundlePath: string, name: string, comment: string, description: string, tags : string[]) : t.VroActionData => {
    const type = `${ t.VroElementType.ScriptModule}`;
    if (!exist(file)) {
        console.warn(`WARN  Cannot find corresponding data xml file "${file}" for metadata file for element of type "${type}". Skipping that element.`);
        return null;
    }
    if (!fileCanRead(file)) {
        console.warn(`WARN  Data xml file "${file}" that corresponds to the ${type} element metadata file "${file}"`
        + `, does exist, but is not readable by current user ("${userInfo().username}"). Please update file mode permissions accordingly. Skipping this element.`);
        return null;
    }
    const xmlContent = decode(fs.readFileSync(file));
    const actionXml = new xmldoc.XmlDocument(xmlContent);
    let scriptName = actionXml.attr["name"];
    scriptName = !scriptName ? name : scriptName;

    const resultType = actionXml.attr["result-type"];
    const apiVersion = actionXml.attr["api-version"] || "6.0.0";
    const version = actionXml.attr["version"];

    let runtime = null;
    let entryHandler = null;
    const params: t.VroActionParameter[] = [];
    let inline = null;
    actionXml.children.forEach((element) => {
        if (element.type == "element" && element?.name == "param") {

            const paramName = element.attr["n"];
            const paramType = element.attr["t"];
            const paramDesc = element.val; // VroNativeFolderElementParser.getDescriptionForParameterFromXml(actionXmlPath, paramName, element);
            const param : t.VroActionParameter = {
                name:        paramName?.trim(),
                type:        paramType?.trim(),
                description: paramDesc?.trim()
            };
            params.push(param);
        } else if (element.type == "element" && element.name == "script") {
            inline = getScriptInline(file, element, comment, this.lazy);
        } else if (element.type == "element" && element.name == "runtime") {
            runtime = element.val;
        } else if (element.type == "element" && element.name == "entry-point") {
            entryHandler = element.val;
        }
    });
    if (scriptName != name) {
        console.warn(`WARN  The name "${scriptName}" of the Scriptable module defined in file "${file}" is different than the name of the same module `
            + `"${name}" defined in the corresponding metadata file "${file}". Please fix the name in the metadata file.`);
    }
    if (apiVersion != "6.0.0") {
        console.warn(`WARN  The api version (${apiVersion}) specified in file "${file}" for ${type} ${scriptName}, `
        + "might not be supported. Currently well supported api version is 6.0.0. Continuing to process as per 6.0.0.");
    }
    const returnType = {name: null, type: resultType, description: getReturnDescriptionFromComment(file, resultType, comment, false)};

    const nativeElement : t.VroActionData =
    {
        version:      version,
        params:       params,
        returnType:   returnType,
        runtime: getScriptRuntime(runtime),
        inline: inline,
        bundle: getScriptBundle(file, bundlePath, entryHandler, comment),
    } as t.VroActionData;
    return nativeElement;

}

export function getScriptRuntime(runtime: string) : t.VroScriptRuntime {
    if (runtime == null) {
        return { lang: t.Lang.javascript, version: ""};
    }
    runtime = runtime.trim();
    const index = runtime.indexOf(":");
    let langString = index == -1 ? runtime : runtime.substring(0, index);
    let langVersion = index == -1 ? "" : index >= runtime.length -1 ? "" : runtime.substring(index+1);
    langString = langString.toLowerCase().trim();
    langVersion = langVersion.toLowerCase().trim();
    let defaultVersion = "";
    const lang : t.Lang = t.Lang[langString];
    switch (lang) {
        case t.Lang.javascript: defaultVersion = ""; break;
        case t.Lang.node: defaultVersion = "12"; break;
        case t.Lang.powercli: defaultVersion = "11-powershell-6.2"; break;
        case t.Lang.python: defaultVersion = "3.7"; break;
        default: throw new Error(`Unsupported runtime language "${langString}". Only supported languages are "javascript", "node", "powercli" and "python".`);
    };
    return {lang: lang, version: langVersion != "" ? langVersion : defaultVersion}
}

function getScriptInline(file : string, element : xmldoc.XmlElement, comment :string, lazy: boolean) : t.VroScriptInline {

    const scriptSource : string = element.val;
    const scriptStartLine : number = element.line;
    const scriptStartIndex : number = element.column;
    const lines: string[] = scriptSource.split("\n");
    const lastLine = lines[lines.length-1];
    let scriptEndLine : number = scriptStartLine + lines.length;
    let scriptEndIndex : number = -1;
    if (lines.length <= 1) {
        scriptEndLine = scriptStartLine;
        scriptEndIndex = scriptStartIndex + lastLine.length;
    } else {
        scriptEndLine = scriptStartLine + lines.length - 1;
        scriptEndIndex = lastLine.length;
    }
    return {
        actionSource: lazy ? null : scriptSource,
        sourceFile:   file,
        sourceStartLine:  scriptStartLine,
        sourceStartIndex: scriptStartIndex,
        sourceEndLine:    scriptEndLine,
        sourceEndIndex:   scriptEndIndex,
        getActionSource: function (action : t.VroActionData):string {
            const jsFile = action.inline.sourceFile;
            const startLine = action.inline.sourceStartLine;
            const startIndex = action.inline.sourceStartIndex;
            const endLine = action.inline.sourceEndLine;
            const endIndex = action.inline.sourceEndIndex;
            const fileContent = fs.readFileSync(jsFile)?.toString();
            const actionSource = getActionBodyFromSourceIndexes(fileContent, startLine, startIndex, endLine, endIndex);
            const trimmed = actionSource.trim();
            const CDATA_START = "<![CDATA[";
            const CDATA_END = "]]>";
            if (trimmed.startsWith(CDATA_START) && trimmed.endsWith(CDATA_END)) {
                return trimmed.substring(CDATA_START.length, trimmed.length - CDATA_END.length);
            }
            return actionSource;
        },
        javadoc: getJavadocFromComment(file, comment)
    }
}

function getScriptBundle(file: string, bundlePath: string, entry: string, comment : string) : t.VroScriptBundle {
    if (exist(bundlePath)) {
        if (entry == null) {
            throw new Error(`Cannot find entry handler (entry-point) for script bundle "${bundlePath}". Please check for entry-point tag in the corresponding data file (metadata file): "${file}".`);
        }
        return {
            contentPath: path.resolve(bundlePath),
            projectPath: getBundlePathFromComment(comment),
            entry: entry.trim(),
        }
    }
    if (entry != null) {
        throw new Error(`Entry point defined as "${entry}" in metadata file  "${file}", but a corresponding bundle zip does not exist as: "${bundlePath}".`);
    }
    return null;
}

function getActionBodyFromSourceIndexes(source : string, startLine : number, startIndex : number, endLine : number, endIndex : number) : string {
    if (!source) {
        return "";
    }
    const lines : string[] = source.split("\n");
    const filtered : string[] = [];
    const len = lines.length;
    for (let i = 0; i < len; i++) {
        const line = lines.shift();
        if (i < startLine || i > endLine) {
            continue;
        }
        let filteredLine = "";
        if (i == startLine && i == endLine) {
            filteredLine = line.substring(startIndex, endIndex);
        } else if (i == startLine) {
            filteredLine = line.substring(startIndex);
        } else if (i == endLine) {
            filteredLine = line.substring(0, endIndex);
       } else {
           filteredLine = line;
       }
       filtered.push(filteredLine);
    }
    return filtered.join("\n");
}

function getJavadocFromComment(file : string, comment : string) : any {
    if (comment == null) {
        return null;
    }
    try {
        return JSON.parse(comment)?.javadoc;
    } catch (e) {
        return null;
    }
}

function getBundlePathFromComment(comment : string) : any {
    if (comment == null) {
        return null;
    }
    try {
        return JSON.parse(comment)?.bundle;
    } catch (e) {
        return null;
    }
}

export const getCommentFromJavadoc = (comment:string, bundle: string, returnType:t.VroActionParameter, javadoc:any) : string => {
    const obj : any = {
        comment: comment,
        returnType:  returnType,
        bundle: bundle,
        javadoc: javadoc,
        crc: null
    };
    obj.crc = (CRC.str(JSON.stringify(obj))& 0x7FFFFFFF).toString(16);
    return JSON.stringify(obj, null, 2);
}

function getReturnDescriptionFromComment(file : string, expectedResultType:string, comment: string, dump: boolean) : string {
    try {
        const obj : any = JSON.parse(comment);
        const resultType = obj?.returnType?.type;
        if (resultType != expectedResultType) {
            return "";
        }
        const crc = obj?.crc;
        obj.crc = null;
        if (crc != (CRC.str(JSON.stringify(obj)) & 0x7FFFFFFF).toString(16)) {
            return "";
        }
        const description = obj?.returnType?.description;
        return description == null ? "" : description;
    } catch (e) {
        return "";
    }
}

function fileCanRead(file:string) : boolean {
    try {
        fs.accessSync(file, fs.constants.R_OK);
        return true;
    } catch (e) {
        return false;
    }
}
