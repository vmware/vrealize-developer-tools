/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as Path from "path";

import * as FileSystem from "fs-extra";
import {XmlDocument} from "xmldoc";
import * as AbstractSyntaxTree from "abstract-syntax-tree";
import * as Comments from "parse-comments";
import * as winston from 'winston';
import * as glob from "glob";

import { VroActionData, VroElementType, VroNativeElement, VroNativeElementAttributes, VroPackageMetadata,VroScriptBundle } from "../types";
import {getCommentFromJavadoc, getScriptRuntime} from "./util";
import {decode} from "../encoding";

export class VroJsProjParser {

    private lazy : boolean;
    constructor(lazy:boolean = true) {
        this.lazy = lazy;
    }

    async parse(vrojsFolderPath: string): Promise<VroPackageMetadata> {
        winston.loggers.get("vrbt").info(`Parsing vro javascript project folder path ${vrojsFolderPath}`);

        const elements: VroNativeElement[] = [];

        // let parser = new VroNativeFolderElementParser();
        const JS_EXTENSION = ".js";
        const baseDir = Path.join(vrojsFolderPath, "src", "main", "resources");
        glob.sync(Path.join(baseDir, "**", `*${ JS_EXTENSION}`)).forEach(jsfile => {
            const content = FileSystem.readFileSync(jsfile);
            const vroPath = jsfile.substring(baseDir.length + 1);
            const moduleIndex = vroPath.lastIndexOf("/");
            const moduleName = vroPath.substring(0, moduleIndex).replace(/\//g, ".");
            const name = vroPath.substring(moduleIndex + 1, vroPath.length - JS_EXTENSION.length);
            const source = content.toString();
            const javadoc : any = VroJsProjParser.getFirstCommentInSource(source, jsfile);
            const description : string = VroJsProjParser.getDescriptionFromJavascriptDoc(javadoc);
            const tags : string[] = VroJsProjParser.getTagsFromJavascriptDoc(javadoc);
            const returns : any = VroJsProjParser.getReturnStatementFromJavascriptDoc(javadoc);
            const id : string = VroJsProjParser.getTagFromJavascriptDoc(javadoc, ["id", "Id", "ID"], "");
            const version : string = VroJsProjParser.getTagFromJavascriptDoc(javadoc, ["version", "Version"], "1.0.0");
            const runtime : string = VroJsProjParser.getTagFromJavascriptDoc(javadoc, ["runtime"], "javascript:ECMA5");
            const bundle : string = VroJsProjParser.getTagFromJavascriptDoc(javadoc, ["bundle"], null);
            const entryHandler : string = VroJsProjParser.getTagFromJavascriptDoc(javadoc, ["entryhandler", "EntryHandler", "Entryhandler"], null);
            const paramsFromDoc : any[] = VroJsProjParser.getParamsFromJavascriptDoc(javadoc);
            const sourceTree : any = VroJsProjParser.getSourceTreeFromSource(source, jsfile);
            const paramsFromSrc : any[] = VroJsProjParser.getParamsFromSource(sourceTree);

            const params : any[] = new Array<any>();
            VroJsProjParser.mergeSetWithUniqueNameKey(params, paramsFromDoc);
            VroJsProjParser.mergeSetWithUniqueNameKey(params, paramsFromSrc);

            const metadata : VroNativeElementAttributes = {
                id: "",
                name: name,
                mimetype: "text/javascript",
                description: description
            };

            let startLine = sourceTree.expression?.body?.loc?.start?.line; // 1 - based
            const startIndex = sourceTree.expression?.body?.loc?.start?.column; // 0 - based
            let endLine = sourceTree.expression?.body?.loc?.end?.line;
            const endIndex = sourceTree.expression?.body?.loc?.end?.column;

            startLine = startLine ? startLine -1 : 0;
            endLine = endLine ? endLine -1 : 0;

            const element : VroNativeElement =
                {
                        categoryPath: moduleName.split(/\./),
                        type:         VroElementType.ScriptModule,
                        id:           id,
                        name:         name,
                        description:  description,
                        comment:      getCommentFromJavadoc("", bundle, returns, javadoc),
                        attributes:     metadata,
                        dataFilePath: jsfile,
                        tags: tags,
                        action:        {
                            version:      version,
                            description:  description,
                            params:       params,
                            returnType:   returns,
                            runtime: getScriptRuntime(runtime),
                            inline: {
                                actionSource: this.lazy ? null : VroJsProjParser.getActionBodyFromSource(sourceTree, source, jsfile),
                                sourceFile:   jsfile,
                                sourceStartLine:  startLine,
                                sourceStartIndex: startIndex,
                                sourceEndLine:    endLine,
                                sourceEndIndex:   endIndex,
                                getActionSource: function (action : VroActionData):string {
                                    const jsFile = action.inline.sourceFile;
                                    const startLine = action.inline.sourceStartLine;
                                    const startIndex = action.inline.sourceStartIndex;
                                    const endLine = action.inline.sourceEndLine;
                                    const endIndex = action.inline.sourceEndIndex;
                                    const fileContent = FileSystem.readFileSync(jsFile)?.toString();
                                    const actionSource = VroJsProjParser.getActionBodyFromSourceIndexes(fileContent, startLine, startIndex, endLine, endIndex);
                                    return actionSource;
                                },
                                javadoc: javadoc?.value
                            },
                            bundle: VroJsProjParser.getScriptBundle(vrojsFolderPath, bundle, entryHandler),
                        }
                } as VroNativeElement;
             elements.push(element);
        }, this);

        const projectInfo = FileSystem.readFileSync(Path.join(vrojsFolderPath, "pom.xml"));
        const pomXml = new XmlDocument(decode(projectInfo));
        return {
            groupId:    pomXml.descendantWithPath("groupId") .val,
            artifactId: pomXml.descendantWithPath("artifactId").val,
            version:    pomXml.descendantWithPath("version") .val,
            packaging:  pomXml.descendantWithPath("packaging") .val,
            elements:   elements,
        } as VroPackageMetadata;
    }

    private static getFirstCommentInSource(source:string, jsFile : string) : any {
        const comments = new Comments({
            "parse": {
                "type": function (type:string, parsed : any, opts : any) : any {
                    try {
                        return Comments.parseType(type, parsed, opts);
                    } catch (e) {
                        console.warn(`WARN: Invalid type "${type}" in documentation for ${parsed?.title} with name "${parsed?.name}"`
                            + ` and description "${parsed?.description}". File: "${jsFile}".`);
                        return {"type":"NameExpression","name": type};
                    }
                }
            }
        });
        comments.parse(source.toString());
        const comment : any[] = comments.ast ? comments.ast : [];
        comment.filter(a=>!a.code?.context?.size).sort((a, b) => a.loc?.start?.line - b.loc?.start?.line);
        const details : any = comment.length ? comment[0] : {};
        return details;
    }

    private static getDescriptionFromJavascriptDoc(details:any) : string {
        return details.description ? details.description : "";
    }

    private static getParamsFromJavascriptDoc(details:any) : any[] {
        const params = new Array<any>();
        const annotations : any[] = details.tags as any[];
        if (annotations == null) {
            return [];
        }
        annotations.filter(a => a.title == "param").forEach(annotation => {
            const param = {
                name: annotation.name,
                type: VroJsProjParser.parseType(annotation.type),
                description: annotation.description
            };
            if (!params.find(e=>e.name == param.name)) {
                params.push(param);
            }
         });
         return params;
    }

    private static getReturnStatementFromJavascriptDoc(details:any) : any {
        const deflt = { type: "any", description: ""};
        const annotations : any[] = details.tags as any[];
        if (annotations == null) {
            return deflt;
        }
        const returns : any = annotations.find(a=>a.title == "return" || a.title == "returns");
        if (returns) {
           return {
               type: VroJsProjParser.parseType(returns.type),
               description: returns.description
           };
        }
           return deflt;

    }

    private static getTagFromJavascriptDoc(details:any, possibleTags:string[], deflt : string) : string {
        const annotations : any[] = details.tags as any[];
        if (annotations == null) {
            return deflt;
        }
        const valueAnnotation : any = annotations.find(a=>possibleTags.includes(a.title));
        let value : string = valueAnnotation?.description;
        value = !!value ? value : deflt;
        return value;
    }

    private static getTagsFromJavascriptDoc(details:any) : string[] {
        const annotations : any[] = details.tags as any[];
        if (annotations == null) {
            return [];
        }
        return annotations.filter(a=>a.title == "tag").map(a=>a.description);
    }

    private static getSourceTreeFromSource(source:string, jsFile : string) : any {
        let tree : any = new AbstractSyntaxTree(source);
        tree = tree._tree ? tree?._tree : tree;
        if (tree?.type != "Program" || tree?.sourceType != "module") {
            throw new Error(`Wrong source type (${tree?.type}) or subtype (${tree.sourceType}) for source file : "${jsFile}". `
               + `Expected type "Program" with subtype "module". Please check that you have just a single Immediately Invoked Function Expression (IIFE) like this: \`(funciton (param1, param2,...){...});\``);
        }
        if (!tree?.body || !tree?.body?.length || tree?.body[0].type != "ExpressionStatement" || !tree?.body[0]?.expression || tree?.body[0]?.expression.type != "FunctionExpression") {
            throw new Error("First source element does not seem to be Immediately Invoked Function Expression (IIFE). Please make sure it looks like this `(function (params...){...});`");
        }
        return tree.body[0];
    }

    private static getParamsFromSource(tree:any) : any[] {
        const params : any[] = new Array<any>();
        const paramElements : any[] = tree.expression.params ? tree.expression.params as any[] : [];
        paramElements.forEach(element => {
            const param = {
                name: element.name,
                type: "any",
                description: ""
            };
            if (!params.find(e=>e.name == param.name)) {
                params.push(param);
            }
        });
        return params;
    }

    private static getActionBodyFromSource(tree: any, source : string, jsFile : string) : string {
        let startLine = tree.expression?.body?.loc?.start?.line; // 1 - based
        const startIndex = tree.expression?.body?.loc?.start?.column; // 0 - based
        let endLine = tree.expression?.body?.loc?.end?.line;
        const endIndex = tree.expression?.body?.loc?.end?.column;

        startLine = startLine ? startLine -1 : 0;
        endLine = endLine ? endLine -1 : 0;
        return this.getActionBodyFromSourceIndexes(source, startLine, startIndex, endLine, endIndex);
    }

    private static getActionBodyFromSourceIndexes(source : string, startLine : number, startIndex : number, endLine : number, endIndex : number) : string {
        let filtered : string[] = [];
        let lines = source.split("\n");
        const len = lines.length;
        let maxIdent : number = Number.MAX_VALUE;
        for (let index = 0; index < len; index++) {
            const line = lines.shift();
            if (index < startLine || index > endLine) {
                continue;
            }
            const tabequivalent = "    ";
            let filteredLine : string;
            if (index != startLine && index != endLine) {
                filteredLine = line;
            } else if (index == startLine && index == endLine) {
                filteredLine = line.substring(startIndex, endIndex);
                filteredLine = filteredLine.charAt(0) == '{' ? filteredLine.substring(1) : filteredLine;
                filteredLine = filteredLine.charAt(filteredLine.length-1) == '}' ? filteredLine.substring(0, filteredLine.length-1) : filteredLine;
            } else if (index == startLine) {
                filteredLine = line.substring(startIndex);
                filteredLine = filteredLine.charAt(0) == '{' ? filteredLine.substring(1) : filteredLine;
            } else {
                filteredLine = line.substring(0, endIndex);
                filteredLine = filteredLine.charAt(filteredLine.length-1) == '}' ? filteredLine.substring(0, filteredLine.length-1) : filteredLine;
            }
            filteredLine = filteredLine.replace("\t", tabequivalent);
            if (maxIdent > 0 && !!filteredLine && filteredLine.length > 0) {
                const index = filteredLine.search(/\S/);
                if (index != -1 && index < maxIdent) {
                    maxIdent = index;
                }
            }
            filtered.push(filteredLine);
        }
        lines = filtered; filtered = null;
        const actionSource = lines.map( (line, index) => {
            if (!!line && line.length > maxIdent) {
                return line.substring(maxIdent);
            }
                return line.search(/\S/) == -1 ? "" : line;

        }).join("\n");
        return actionSource;
    }

    private static mergeSetWithUniqueNameKey(destination : any[], extra : any[]) : any[] {
        if (!extra) {
            return destination;
        }
        extra.forEach(element=>{
            if (!destination.find(a=>a.name == element.name)) {
                destination.push(element);
            }
        });
        return destination;
    }

    private static parseType(type:any) : string {
        const primitiveTypes : string[] = ["boolean", "number", "string", "any", "undefined", "null", "object"];
        if (type?.type == "NameExpression") {
            const typeName:string = type.name ? type.name : `${ JSON.stringify(type)}`;
            for (const index in primitiveTypes) {
                if (typeName.toLowerCase() == primitiveTypes[index]) {
                    return primitiveTypes[index];
                }
            }
            return typeName;
        }
        return "any";
    }

    private static getScriptBundle(vrojsFolderPath: string, bundle : string, entryhandler : string) : VroScriptBundle {
        if (bundle == null) {
            if (entryhandler != null) {
                throw new Error(`Cannot specify entryhandler (${entryhandler}), without also specifying a bundle. Use @bundle tag to specify path to zip file or dir.`);
            }
            return null;
        }
        if (entryhandler == null) {
            throw new Error(`Need to specify an entryhandler for a bundle ("${bundle}"). Please use @entryhandler tag to specify entrypoint inside the bundle.`);
        }
        const absolutePath = Path.isAbsolute(bundle) ? bundle : Path.resolve(vrojsFolderPath, bundle)
        return { contentPath: absolutePath, projectPath: bundle, entry: entryhandler};
    }
}
