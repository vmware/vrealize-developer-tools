/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as path from "path";

import * as fs from "fs-extra";
import archiver from 'archiver';
import * as xmlbuilder from "xmlbuilder";

import * as t from "../types";
import { complexActionComment, getActionXml, saveOptions, serialize, xmlOptions} from "./util"
import { exist, isDirectory} from "../util";

const buildContext = (target: string) => {

    const store = serialize(target);

    return {
        target: target,
        pom: store("pom.xml"),
        elements: (category, name) => serializeTreeElementContext(path.join(target, category), name)
    }
}


const serializeTreeElementContext = (target: string, elementName: string) => {

    const store = serialize(target);

    return {
        target: target,
        data: (element: t.VroNativeElement, sourceFile : string, type : t.VroElementType) => {
            if(type == t.VroElementType.ResourceElement){
                return fs.copyFile(sourceFile, path.join(target, `${elementName}`))
            } else if (type == t.VroElementType.ScriptModule) {
                const elementXmlPath = path.join(target, `${elementName}.xml`)
                const actionXml = getActionXml(element.id, element.name, element.description, element.action);
                return fs.writeFile(elementXmlPath, actionXml);
            }
            return fs.copyFile(sourceFile, path.join(target, `${elementName}.xml`));
        },
        bundle: (element: t.VroNativeElement, bundle: t.VroScriptBundle) => {
            if (bundle == null) {
                return Promise.resolve(); // Empty promise that does nothing. Nothing needs to be done since bundle file does not exist.
            }
            const bundleFilePathSrc = bundle.contentPath;
            if (!exist(bundleFilePathSrc)) {
                throw new Error(`Bundle path "${bundleFilePathSrc}" does not exist. Cannot get script bundle for element `
                    + `"${element.name}" of type "${element.type}"; category "${element.categoryPath}"; id: "${element.id}"`);
            }
            const bundleFilePathDest = path.join(target, `${elementName}.bundle.zip`);
            if (isDirectory(bundleFilePathSrc)) {
                const output = fs.createWriteStream(bundleFilePathDest);
                const archive = archiver('zip', { zlib: { level: 9 } });
                archive.directory(bundleFilePathSrc, false);
                archive.pipe(output);
                archive.finalize();
            } else {
                return fs.copyFile(bundleFilePathSrc, bundleFilePathDest);
            }
        },
        info: store(`${elementName}.element_info.xml`),
        tags: store(`${elementName}.tags.xml`), // TODO - validate extension
        form: (element: t.VroNativeElement) => {
            if(element.form) {
                fs.writeFile(path.join(target, `${elementName}.form.json`), JSON.stringify(element.form, null, 4));
            }
        }
    }
}


const serializeTreePom = (context: any, pkg: t.VroPackageMetadata) => {
    context.pom(
        xmlbuilder.create("project", xmlOptions)
            .attribute("xmlns", "http://maven.apache.org/POM/4.0.0")
            .attribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
            .attribute("xsi:schemaLocation", "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd")
            .ele("modelVersion").text("4.0.0").up()
            .ele("groupId").text(pkg.groupId).up()
            .ele("artifactId").text(`${pkg.artifactId }test`).up()
            .ele("version").text(pkg.version).up()
            .ele("packaging").text(pkg.packaging).up()
            .end(saveOptions)
    );
}

const serializeTreeElement = async (context: any, element: t.VroNativeElement): Promise<void[]> => {
    const xInfo = xmlbuilder.create("properties", xmlOptions)
    xInfo.dtd("", "http://java.sun.com/dtd/properties.dtd")
    xInfo.ele("comment").cdata(complexActionComment(element));

    if (element.type == t.VroElementType.ResourceElement) {
        xInfo.ele("entry").att("key", "mimetype").text(element.attributes["mimetype"])
    }
    const categoryPathKay = element.type == t.VroElementType.ScriptModule
        ? element.categoryPath
        : element.categoryPath.map(c => c.replace(/\./g, "/."))
    const pathKey : string = categoryPathKay.join(".");

    const categoryPath = element.type == t.VroElementType.ScriptModule
        ? element.categoryPath.pop().split('.')
        : element.categoryPath;

    xInfo
        .ele("entry").att("key", "categoryPath").text(pathKey).up()
        .ele("entry").att("key", "name").text(element.name).up()
        .ele("entry").att("key", "type").text(element.type.toString()).up()
        .ele("entry").att("key", "id").text(element.id)

    const xTags = xmlbuilder.create("tags", xmlOptions);
    element.tags.forEach(name => {
        xTags.ele("tag").att("name", name).att("global", "true").up();
    })

    const elementContext = context.elements(path.join(
        ...["src", "main", "resources", element.type, ...categoryPath]
    ), element.name);


    return Promise.all([
        elementContext.data(element, element.dataFilePath, element.type),
        elementContext.bundle(element, element?.action?.bundle),
        elementContext.info(xInfo.end(saveOptions)),
        elementContext.tags(xTags.end(saveOptions)),
        elementContext.form(element)
    ]);
}

const serializeTree = (pkg: t.VroPackageMetadata, target: string) => {
    const context = buildContext(target);
    serializeTreePom(context, pkg)
    pkg.elements.forEach(element => serializeTreeElement(context, element));
}

export { serializeTree }
