/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as path from "path";

import * as glob from "glob";

import * as t from "../types";
import { read, stringToCategory, xml, xmlChildNamed, xmlGet, xmlToAction, xmlToTag } from "./util";
import { exist} from "../util";


function parseTreeElement(elementInfoPath: string): t.VroNativeElement {
    const info = xml(read(elementInfoPath));

    const categoryPath = stringToCategory(xmlGet(info, "categoryPath"));
    const id = xmlGet(info, "id");
    const type = t.VroElementType[xmlGet(info, "type")];
    let name = xmlGet(info, "name");
    let attributes = {};
    let dataFilePath = elementInfoPath.replace(".element_info.xml", ".xml");
    const bundleFilePath = elementInfoPath.replace(".element_info.xml", ".bundle.zip");
    const elementTagPath = elementInfoPath.replace(".element_info.xml", ".tags.xml");
    const elementInputFormPath = elementInfoPath.replace(".element_info.xml", ".form.json");
    const infoXml = xml(read(elementInfoPath));
    const description = xmlGet(infoXml, "description");
    const comment = xmlChildNamed(infoXml, "comment");
    let form = null;
    let tags : string[]= [];
    let action : t.VroActionData = null;

    // Tags are optional
    if(exist(elementTagPath)){
        const tagsContent = read(elementTagPath);
        if (tagsContent.trim() !== '') {
            const tagsXml = exist(elementTagPath) && xml(tagsContent);
            tags = tags.concat(xmlToTag(tagsXml));
        }
    }

    // Form only for WF
    if(exist(elementInputFormPath)){
        form = JSON.parse(read(elementInputFormPath));
    }

    if (type == t.VroElementType.ResourceElement) {
        attributes = {
            id: xmlGet(info, "id"),
            name: xmlGet(info, "name"),
            version: xmlGet(info, "version") || "0.0.0",
            mimetype: xmlGet(info, "mimetype"),
            description: xmlGet(info, "description") || "",
            allowedOperations: "vf" // There is no information in NativeFolder. Using defaults
        } as t.VroNativeResourceElementAttributes;
        dataFilePath = dataFilePath.replace(".xml", "");
    } else if (type == t.VroElementType.ScriptModule) {
        name = xml(read(dataFilePath)).attr.name;
        action = xmlToAction(dataFilePath, bundleFilePath, name, comment, description, tags);
    }

    return { categoryPath, type, id, name, description, attributes, dataFilePath, tags, action, form } as t.VroNativeElement;
}


async function parseTree(nativeFolderPath: string): Promise<t.VroPackageMetadata> {

    const pomXml = xml(read(path.join(nativeFolderPath, "pom.xml")))

    const elements = glob
        .sync(path.join(nativeFolderPath, "**", "*.element_info.xml"))
        .map(file => parseTreeElement(file)
        );

    return {
        groupId: pomXml.descendantWithPath("groupId").val,
        artifactId: pomXml.descendantWithPath("artifactId").val,
        version: pomXml.descendantWithPath("version").val,
        packaging: pomXml.descendantWithPath("packaging").val,
        description: pomXml.descendantWithPath("description")?.val || "",
        elements: elements
    } as t.VroPackageMetadata;;
}

export { parseTree };
