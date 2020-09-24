/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as path from "path";

import * as FileSystem from "fs-extra";
import * as XmlBuilder from "xmlbuilder2";
import * as unzipper from 'unzipper';
import * as winston from 'winston';

import {Lang, VroActionData, VroActionParameter, VroNativeElement, VroPackageMetadata, VroScriptBundle} from "../types";
import { exist, isDirectory} from "../util";

const saveOptions = {
    prettyPrint: true
}

const xmlOptions = {
    version: "1.0",
    encoding: "UTF-8",
    standalone: false
};

export class VroJsProjRealizer {

    private lazy : boolean;
    constructor(lazy:boolean = true) {
        this.lazy = lazy;
    }

    static realizeElement(element: VroNativeElement, nativeFolder: string) {
        const categoryPath : string[] = element.categoryPath;
        const type : string = element.type || "UnknownType";
        const id : string = element.id;
        const name : string = element.name;
        const description: string = element.description == null ? "" : element.description;
        const tags : string[] = element.tags;
        const action: VroActionData = element?.action;

        if (type == "ScriptModule") {
            let dirs : string[] = [nativeFolder, "src", "main", "resources"];
            for (const path of categoryPath) {
                const categories = path.split(".");
                dirs = dirs.concat(categories);
            }
            const basePath = path.join.apply(null, dirs);
            VroJsProjRealizer.writeJsFile(nativeFolder, basePath, `${name }.js`, id, description, tags, action);
            if (action.bundle != null) {
                VroJsProjRealizer.writeBundleFile(nativeFolder, basePath, action.bundle);
            }
        } else {
            const dirs : string[] = [nativeFolder, "src", "main", "resources", type].concat(categoryPath);
            const basePath = path.join.apply(null, dirs);
            VroJsProjRealizer.writeOtherResource(basePath, name, element);
        }
    }

    private static writeJsFile(nativeFolder: string, dir: string, filename : string, id : string, description:string, tags: string[], action : VroActionData) : void {
        const file = path.join(dir, filename);
        const version : string = action.version;
        const params: VroActionParameter[] = action.params;
        const returnType: VroActionParameter = action.returnType;
        let actionSource : string = action.inline?.actionSource;
        const sourceFile : string = action.inline?.sourceFile;
        const getActionSource : (action : VroActionData) => string = action.inline?.getActionSource;

        if (actionSource == null && getActionSource != null) {
            try {
                actionSource = getActionSource(action);
            } catch (e) {
                throw new Error(`ERROR Cannot read action source for "${file}" from source file "${sourceFile}" : ${ JSON.stringify(e)}`);
            }
        }

        let doc : string[] = [];
        doc.push("/**");
        doc = doc.concat(description.split("\n").map(line=>` * ${ line}`));
        if (action?.runtime?.lang != null && action?.runtime?.lang != Lang.javascript) {
            doc = doc.concat(` * @runtime ${ Lang[action.runtime.lang] }:${ action.runtime.version}`);
        }
        let bundleDest : string = VroJsProjRealizer.getScriptBundleDestination(nativeFolder, dir, action.bundle);
        bundleDest = action.bundle.projectPath != null ? action.bundle.projectPath : path.relative(nativeFolder, bundleDest);
        if (action?.bundle != null) {
            doc = doc.concat(` * @bundle ${ bundleDest}`);
            doc = doc.concat(` * @entryhandler ${ action.bundle.entry}`);
        }
        doc = doc.concat(params.map(param =>
            ` * @param {${ param.type }} ${ param.name } ${
             param.description.trim().split("\n").filter(VroJsProjRealizer.isNotLastAndEmpty).join("\n * ")}`
        ));
        doc.push(
            ` * @returns {${ returnType.type }} ${
             returnType.description.split("\n").filter(VroJsProjRealizer.isNotLastAndEmpty).join("\n * ")}`
        );
        if (id != null && id != "") {
            doc.push(` * @id ${ id}`);
        }

        if (version != null && version != "") {
            doc.push(` * @version ${ version}`);
        }
        if (tags != null && tags.length > 0) {
            doc = doc.concat(tags.map(tag=>` * @tag ${ tag}`));
        }
        doc.push(" */");
        let docs : string = doc.join("\n");

        let iife : string = "(function (";
        for (let index = 0; index < params.length; index++) {
            const param = params[index];
            iife += param.name;
            const isLast = index + 1 >= params.length;
            if (!isLast) {
                iife += ", ";
            }
        }

        iife += ") {\n";
        if (actionSource != null) {
            const ident: string = VroJsProjRealizer.getPreferredIdent(actionSource);
            iife += actionSource.split("\n").filter(VroJsProjRealizer.isNotLastAndEmpty).map(line=>ident + line).join("\n");
        }
        iife += "\n});"
        actionSource = null;
        const content = `${docs }\n${ iife }\n`;
        docs = null;
        iife = null;

        FileSystem.mkdirsSync(dir);
        FileSystem.writeFile(file, content);
    }

    private static writeBundleFile(nativeFolder : string, basePath:string, bundle : VroScriptBundle) {
        if (bundle == null) {
            return;
        }
        if (!exist(bundle.contentPath)) {
            throw new Error(`Bundle file content not found "${bundle.contentPath}". Cannot copy it under "${bundle.projectPath}".`);
        }
        const dest : string = VroJsProjRealizer.getScriptBundleDestination(nativeFolder, basePath, bundle);
        if (exist(dest)) {
            FileSystem.remove(dest);
        }

        if (isDirectory(bundle.contentPath)) {
            FileSystem.copy(bundle.contentPath, dest);
        } else {
            FileSystem.mkdirs(dest);
            const extractor = unzipper.Extract({ path: dest })
            return FileSystem.createReadStream(bundle.contentPath).pipe(extractor).promise().catch(error => {
                winston.loggers.get("vrbt").info( `Error extracting "${bundle.contentPath}" into "${dest}".` +
                    `Error ${error.message}, file ${error.fileName}, line ${error.lineNumber}`
                );
            })
        }
    }

    private static getScriptBundleDestination(nativeFolder:string, basePath:string, bundle:VroScriptBundle) : string {
        let dest : string = bundle.projectPath == null ? path.join.apply(null, [path.resolve(basePath), "bundle"]) : bundle.projectPath;
        if (!path.isAbsolute(dest)) {
            dest = path.resolve(nativeFolder, dest);
        }
        return dest;
    }

    private static isNotLastAndEmpty(line : string, index : number, arr : string[]) {
        return line != "" || index != arr.length-1;
    }

    private static getPreferredIdent(source : string) : string {
        const lines: string[] = source.split("\n");
        const score = lines.reduce((sum,line) => sum + VroJsProjRealizer.getIndent(line),0);
        return score >= 0 ? "    " : "\t";
    }

    private static getIndent(line:string) : number {
        if (line == null) {
            return 0;
        }
        let tabs : number = 0;
        let spaces : number = 0;
        for (let index : number =0; index < line.length; index++) {
            const chr : string = line.charAt(index);
            if (chr == "\t") {
                tabs++;
            } else if (chr == " ") {
                spaces ++;
            } else {
                break;
            }
        }
        if (tabs > 0 && spaces > 0) {
            return 0; // Cannot decide for mixed usage of indent.
        }
        if (tabs == 0 && spaces == 0) {
            return 0; // No identation on that line.
        }
        return spaces > 0 ? 1 : -1;
    }

    private static writeOtherResource(basePath : string, name : string, element:VroNativeElement) : void {

        const elementXmlPath = path.join(basePath, `${name }.xml`);
        const elementInfoXmlPath = path.join(basePath, `${name }.element_info.xml`);
        const elementTagsPath = path.join(basePath, `${name }.tags.xml`);
        FileSystem.mkdirsSync(basePath);

        // Content
        FileSystem.copyFile(element.dataFilePath, elementXmlPath);

        // Meta Info.
        const comment : string = "Created by VMware Professional Services Center of Excellence (PSCoE) Toolchain";
        const elementInfoXml = XmlBuilder.create(xmlOptions).ele("properties");
        elementInfoXml.dtd({ pubID: "", sysID: "http://java.sun.com/dtd/properties.dtd"})
        elementInfoXml.ele("comment").dat(comment);

        if (element.type == "ResourceElement") {
            elementInfoXml.ele("entry").att("key", "mimetype").txt(element.attributes["mimetype"])
        }

        elementInfoXml
            .ele("entry").att("key", "categoryPath").txt(element.categoryPath.join(".")).up()
            .ele("entry").att("key", "name" ).txt(element.name ).up()
            .ele("entry").att("key", "type" ).txt(element.type ).up()
            .ele("entry").att("key", "id" ).txt(element.id ).up()
            .ele("entry").att("key", "description" ).txt(element.description ).up();
        FileSystem.writeFile(elementInfoXmlPath, elementInfoXml.end(saveOptions));

        // Tags
        const elementTagsXml = XmlBuilder.create({version: "1.0", encoding: "UTF-8"}).ele("tags");
        const tags = element?.tags || [];
        for (const index in tags) { elementTagsXml.ele("tag").att("name", tags[index]).att("global", "true").up(); }
        FileSystem.writeFile(elementTagsPath, elementTagsXml.end(saveOptions));
    }

    async realize(pkg: VroPackageMetadata, nativeFolder: string) : Promise<void>{
        this.realizePom(pkg, nativeFolder);
        pkg.elements.forEach(element => {
            VroJsProjRealizer.realizeElement(element, nativeFolder);
        })
    }


    private realizePom(pkg: VroPackageMetadata, nativeFolder: string) {

        const node = XmlBuilder.create(xmlOptions).ele("project");
        node.att("xmlns", "http://maven.apache.org/POM/4.0.0")
        node.att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
        node.att("xsi:schemaLocation", "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd")

        node
            .ele("modelVersion") .txt("4.0.0" ) .up()
            .ele("groupId" ) .txt(pkg.groupId ) .up()
            .ele("artifactId" ) .txt(pkg.artifactId) .up()
            .ele("version" ) .txt(pkg.version ) .up()
            .ele("packaging" ) .txt(pkg.packaging ) .up()

        FileSystem.mkdirsSync(nativeFolder)
        return FileSystem.writeFile(path.join(nativeFolder, "pom.xml"), node.end(saveOptions))
    }
}
