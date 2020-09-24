/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as path from "path";

import * as fs from "fs-extra";
import * as glob from "glob";
import * as winston from 'winston';

import * as a from "../packaging";
import * as t from "../types";
import { getCommentFromJavadoc, read, xml, xmlChildNamed, xmlGet, xmlToAction, xmlToCategory, xmlToTag} from "./util";
import { exist} from "../util";


/**
 * Extracts a vRO element of out unziped Package element folder
 * @param elementInfoPath - vro_package/elements/<id>/info
 */
const parseFlatElement = async(elementInfoPath: string): Promise<t.VroNativeElement> => {
    const source = path.dirname(elementInfoPath);
    const sourcePath = name => path.join(source, name);

    const elementCategoryPath = sourcePath("categories");
    const elementTagPath = sourcePath("tags");
    const elementDataPath = sourcePath("data");
    const elementInputFormPath = sourcePath("input_form_")

    const infoXml = xml(read(elementInfoPath));
    const categoriesXml = xml(read(elementCategoryPath));


    const categoryPath = xmlToCategory(categoriesXml);
    const description = xmlGet(infoXml, "description");
    let comment = xmlChildNamed(infoXml, "comment");
    const type = t.VroElementType[xmlGet(infoXml, "type")];
    const id = xmlGet(infoXml, "id");
    let name;
    const attributes = {} as t.VroNativeResourceElementAttributes;
    let dataFilePath = elementDataPath;

    let tags = [];
    // Tags are optional
    if(exist(elementTagPath)){
        const tagsXml = exist(elementTagPath) && xml(read(elementTagPath));
        tags = tags.concat(xmlToTag(tagsXml))
    }

    // Input Form only for Workflows
    let form = null;
    if(exist(elementInputFormPath)){
        form = JSON.parse(read(elementInputFormPath));
    }
    let action : t.VroActionData = null;


    switch (type) {
        case t.VroElementType.Workflow:
        case t.VroElementType.ConfigurationElement:
            name = xml(read(elementDataPath)).valueWithPath("display-name");
            break;
        case t.VroElementType.ScriptModule:
            const elementBundlePath = sourcePath("bundle")
            name = xml(read(elementDataPath)).attr.name;
            action = xmlToAction(elementDataPath, elementBundlePath, name, comment, description, tags);
            comment = getCommentFromJavadoc(comment, action?.bundle?.projectPath, action.returnType, action?.inline?.javadoc);
            break;
        case t.VroElementType.PolicyTemplate:
            name = xml(read(elementDataPath)).attr.name;
            break;
        case t.VroElementType.ResourceElement:
            await a.extract(elementDataPath, source);

            const mapping = t.VroNativeResourceElementAttributesMapping;

            Object.keys(mapping).forEach(key => {
                const filePath = path.join(source, t.VSO_RESOURCE_INF, mapping[key]);
                if (fs.existsSync(filePath)) {
                    attributes[key] = fs.readFileSync(filePath)
                } else {
                    winston.loggers.get("vrbt").debug(`Resource Element data bundle does not specify optional attribute ${mapping[key]}`);
                }
            });

            name = attributes["name"];
            dataFilePath = path.join(source, t.VSO_RESOURCE_INF, "data");
            break;
    }
    return { categoryPath, type, id, name, description, comment, attributes, dataFilePath, tags, action, form} as t.VroNativeElement;
}

const parseFlat = async(nativePackagePath: string, destDir: string) => {
    const tmp = path.join(destDir, "tmp");
    winston.loggers.get("vrbt").info(`Extracting package ${nativePackagePath} to ${tmp}`);

    await a.extract(nativePackagePath, tmp);

    // com.vmware.pscoe.library.vra-1.0.0-SNAPSHOT
    const dunesMetaInf = xml(read(path.join(tmp, "dunes-meta-inf")))
    const pkgName = dunesMetaInf.childWithAttribute("key", "pkg-name").val;
    const pkgDescription = dunesMetaInf.childWithAttribute("key", "pkg-description").val;
    const endArtifactIndex = pkgName.endsWith("-SNAPSHOT") ? pkgName.length-"-SNAPSHOT".length : pkgName.lastIndexOf("-");
    const pkgArtifactTokens = pkgName.slice(0, endArtifactIndex).split(".");

    const elements = await Promise.all(
        glob
            .sync(path.join(tmp, "elements", "**", "info"))
            .map(file => parseFlatElement(file))
    );

    const result = {
        groupId: pkgArtifactTokens.slice(0, -1).join("."),
        artifactId: pkgArtifactTokens.slice(-1).pop(),
        version: pkgName.slice(endArtifactIndex+1),
        description: pkgDescription,
        packaging: "package",
        elements: elements
    } as t.VroPackageMetadata;
    fs.remove(tmp);
    return result;

}

export { parseFlat };
