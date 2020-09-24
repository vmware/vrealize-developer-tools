/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as path from "path";

import * as fs from "fs-extra";
import * as glob from "glob";
import * as winston from 'winston';
import * as xmlbuilder from "xmlbuilder";
import v5 from 'uuid/v5';

import * as t from "../types";
import * as s from "../security";
import * as p from "../packaging"
import { exist, isDirectory} from "../util";
import {getActionXml, getPackageName, infoOptions, saveOptions, serialize, xmlOptions, zipbundle} from "./util"

const
    DUNES_META_INF = "dunes-meta-inf",
    CERTIFICATES = "certificates",
    ELEMENTS = "elements",
    CATEGORIES = "categories",
    CONTENT_SIGNATURE = "content-signature",
    DATA = "data",
    BUNDLE = "bundle",
    // DATA_VSO_RESOURCE_INF = "VSO-RESOURCE-INF",
    DATA_ALLOWEDOPERATIONS = "attribute_allowedOperations",
    DATA_DESCRIPTION = "attribute_description",
    DATA_ID = "attribute_id",
    DATA_MIMETYPE = "attribute_mimetype",
    DATA_NAME = "attribute_name",
    DATA_VERSION = "attribute_version",
    INFO = "info",
    TAGS = "tags",
    SIGNATURES = "signatures",
    INPUT_FORM = "input_form_";


const buildContext = (target: string) => {
    // Clean up before start
    fs.pathExistsSync(target) && fs.removeSync(target);

    const bundle = (name): Promise<void> => {
        const arch = p.archive(path.join(target, name));
        [CERTIFICATES, ELEMENTS, SIGNATURES].forEach(folder => arch.directory(path.join(target, folder), folder));
        return arch.append(fs.createReadStream(path.join(target, DUNES_META_INF)), { name: DUNES_META_INF }).finalize();
    }

    const store = serialize(target);

    return {
        target: target,
        dunesMetaInf: store(DUNES_META_INF),
        certificates: subjectName => store(path.join(CERTIFICATES, subjectName)),
        elements: elementId => buildElementContext(path.join(target, ELEMENTS, elementId)),
        signatures: signature => store(path.join(SIGNATURES, signature)),
        save: bundle
    }
}

const buildElementContext = (target: string) => {

    const store = serialize(target);
    const storezipped = zipbundle(target);

    return {
        target,
        categories: store(CATEGORIES),
        contentSignature: store(CONTENT_SIGNATURE),
        data: store(DATA),
        bundle: storezipped(BUNDLE),
        dataComplex: serializeFlatElementData(path.join(target, DATA)),
        info: store(INFO),
        tags: store(TAGS),
        form: store(INPUT_FORM)
    }
}

const serializeFlatElementData = (target: string) => {
    const bundle = p.archive(target);

    const append = name => data => {
        if(data){
            bundle.append(Buffer.from(data, 'utf8'), { name: `${t.VSO_RESOURCE_INF}/${name}` })
        }else{
            winston.loggers.get("vrbt").debug(`Element not available ${t.VSO_RESOURCE_INF}/${name}`);
        }
    };

    return {
        target: target,
        allowedOperations: append(DATA_ALLOWEDOPERATIONS),
        description: append(DATA_DESCRIPTION),
        id: append(DATA_ID),
        mimetype: append(DATA_MIMETYPE),
        name: append(DATA_NAME),
        version: append(DATA_VERSION),
        data: append(DATA),
        save: () => bundle.finalize()
    }
}

const serializeFlatCertificate = async (context: any, pkg: t.VroPackageMetadata): Promise<void[]> => {
    const future = [];
    pkg.certificate.chain.forEach((pem, subject) => {
        future.push(context.certificates(`${subject}.cer`)(s.pemToDer(pem), { encoding: "binary" }));
    })
    return future;
}

const serializeFlatDunesMetadata = async (context: any, pkg: t.VroPackageMetadata): Promise<void> => {
    const node = xmlbuilder.create("properties", xmlOptions)
    node.dtd("", "http://java.sun.com/dtd/properties.dtd");
    node.ele("comment").text("UTF-16").up()
        // Generates Package ID based on the FQ Package Name
        .ele("entry").att("key", "pkg-id").text(v5(`http://${ getPackageName(pkg)}`, v5.URL)).up()
        .ele("entry").att("key", "pkg-name").text([pkg.groupId, pkg.artifactId, pkg.version, pkg.packaging].join(".")).up()
        .ele("entry").att("key", "pkg-description").text(pkg.description || "Built by vRealize Build Tools").up()
        .ele("entry").att("key", "pkg-signer").text(pkg.certificate.subject).up()
        .ele("entry").att("key", "pkg-owner").text(pkg.certificate.subject)

    return context.dunesMetaInf(node.end(saveOptions));
}

const serializeFlatElements = async (context: any, pkg: t.VroPackageMetadata) => {
    return pkg.elements.map(async element => {
        const elementContext = context.elements(element.id)
        await Promise.all([
            serializeFlatElementInfo(elementContext, pkg, element),
            serializeFlatElementCategory(elementContext, element),
            serializeFlatElementContent(elementContext, element),
            serializeFlatElementBundle(elementContext, element),
            serializeFlatElementTags(elementContext, element),
            serializeFlatElementInputForm(elementContext, element)
        ]);
        return exportPackageElementContentSignature(elementContext, pkg);
    })
}


const serializeFlatElementInfo = async (context: any, pkg: t.VroPackageMetadata, element: t.VroNativeElement): Promise<void> => {
    const node = xmlbuilder.create("properties", infoOptions)
    node.dtd("", "http://java.sun.com/dtd/properties.dtd")
    node.ele("comment").text("UTF-16").up()
        .ele("entry").att("key", "type").text(element.type.toString()).up()
        .ele("entry").att("key", "signature-owner").text(pkg.certificate.subject).up()
        .ele("entry").att("key", "id").text(element.id)
    return context.info(node.end(saveOptions));
}

const serializeFlatElementInputForm = async (context: any, element: t.VroNativeElement): Promise<void> => {
    if(element.form) {
        return context.form(JSON.stringify(element.form), { encoding: "utf16le" });
    }
}


const serializeFlatElementCategory = async (context: any, element: t.VroNativeElement): Promise<void> => {
    const categories = xmlbuilder.begin().ele(CATEGORIES);
    (element.type == t.VroElementType.ScriptModule
        ? [element.categoryPath.join(".")]
        : element.categoryPath
    ).forEach((path) => {
        const realName = path.replace(/\//g, "");
        categories.ele("category").att("name", realName).ele("name").dat(realName)
    });
    return context.categories(Buffer.from(`\ufeff${ categories.end()}`, "utf16le").swap16(), { encoding: "utf16le" });
}

const serializeFlatElementBundle = async (context: any, element: t.VroNativeElement): Promise<void> => {
    if(!element?.action?.bundle){
        return;
    }
    if (!exist(element.action.bundle.contentPath)) {
        throw new Error(`Source script bundle "${element.action.bundle.contentPath}" does not exist for element `
            + `${element.name}" of type "${element.type}", category "${element.categoryPath}", id: "${element.id}". `
            + `Cannot save script bundle.`);
    }
    const isDir = isDirectory(element.action.bundle.contentPath);
    return context.bundle(element.action.bundle.contentPath, isDir);
}

const serializeFlatElementTags = async (context: any, element: t.VroNativeElement): Promise<void> => {
    if(!element.tags || !element.tags.length){
        winston.loggers.get("vrbt").debug(`Element does not have tags ${element.name}`);
        return;
    }
    const node = xmlbuilder.create("tags",xmlOptions);
    element.tags.forEach(name => {
        node.ele("tag").att("name", name).att("global", true).up()
    })
    return context.tags(node.end(saveOptions));
}

const serializeFlatElementContent = async (context: any, element: t.VroNativeElement): Promise<void> => {
    let content = null;
    if (element.type == t.VroElementType.ScriptModule) {
        content = getActionXml(element.id, element.name, element.description, element.action);
    } else {
        content = fs.readFileSync(element.dataFilePath).toString()
    }
    const contentBuffer = Buffer.from(`\ufeff${ content}`, "utf16le").swap16();

    if (element.type == t.VroElementType.ResourceElement) {
        const data = context.dataComplex;
        const value = name => element.attributes[name.replace('attribute_', '')]

        // Order is important for ZIP checksum
        data.id(value(DATA_ID));
        data.name(value(DATA_NAME));
        data.version(value(DATA_VERSION));
        data.description(value(DATA_DESCRIPTION));
        data.mimetype(value(DATA_MIMETYPE));
        data.allowedOperations(value(DATA_ALLOWEDOPERATIONS));
        data.data(contentBuffer, { encoding: "utf16le" });
        return data.save();
    }
        return context.data(contentBuffer, { encoding: "utf16le" });

}

const exportPackageElementContentSignature = async (context: any, pkg: t.VroPackageMetadata): Promise<void> => {
    const data = await fs.readFile(path.join(context.target, DATA));
    return context.contentSignature(s.sign(data, pkg.certificate));
}

const serializeFlatSignatures = async (context: any, pkg: t.VroPackageMetadata): Promise<void[]> => {
    const promises = [];
    const target = context.target;

    glob.sync(`${target }/**/*`, { nodir: true }).forEach(file => {
        const location = path.normalize(file).replace(target, "");
        const data = s.sign(fs.readFileSync(file), pkg.certificate);
        const signature = context.signatures(location)(data);
        promises.push(signature);
    })
    return promises;
}

const serializeFlat = async (pkg: t.VroPackageMetadata, targetPath: string) => {
    const context = buildContext(targetPath);
    await Promise.all([
        serializeFlatCertificate(context, pkg),
        serializeFlatDunesMetadata(context, pkg),
        serializeFlatElements(context, pkg),
    ])

    await serializeFlatSignatures(context, pkg);
    return context.save(getPackageName(pkg));
}

export { serializeFlat };
