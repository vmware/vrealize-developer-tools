/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import * as path from "path";

import * as fs from "fs-extra";
import archiver from 'archiver';
import * as winston from 'winston';
import * as xmlbuilder from "xmlbuilder";
import * as CRC from "crc-32";

import * as t from "../types";

export const saveOptions = {
    pretty: true
}

export const xmlOptions = {
    version: "1.0",
    encoding: "UTF-8"
};

export const infoOptions = {
    version: "1.0",
    encoding: "UTF-8",
    standalone: false
};

export const serialize = target => {
    fs.mkdirsSync(target);
    return file => async (data, options?): Promise<void> => {
        const absolutePath = path.join(target, file);
        fs.mkdirsSync(path.dirname(absolutePath));
          winston.loggers.get("vrbt").debug(`Writing ${absolutePath}`);
        fs.writeFile(absolutePath, data, options || {});
    }
}

/**
 * Used to asynchronously write a resource that is can be optionally zipped.
 * @param target The target directory where the new resource should be placed.
 * @return A function that ccepts a destination file name (for a resource) and based on it
 *         itself returns a fuction that can be used to write that resource.
 *         Finally the function that writes the resource is an asynchronous one.
 */
export const zipbundle = (target : string )=> {
    fs.mkdirsSync(target);
    return (file : string )=> async (sourcePath : string, isDir: boolean): Promise<void> => {
        const absoluteZipPath = path.join(target, file);
        if (isDir) {
            const output = fs.createWriteStream(absoluteZipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });
            archive.directory(sourcePath, false);
            archive.pipe(output);
            archive.finalize();
        } else {
            fs.copy(sourcePath, absoluteZipPath);
        }
    }
}

export const getPackageName = (pkg: t.VroPackageMetadata): string => {
    return [pkg.groupId, pkg.artifactId, pkg.version, pkg.packaging].join(".");
}

export const getActionXml = (id : string, name : string, description:string, action:t.VroActionData) : string => {
    description = description == null ? "" : description;
    let actioncontent = action?.inline?.actionSource;
    if (!actioncontent) {
        actioncontent = action.inline?.getActionSource(action);
    }
    const elementInfoXml = xmlbuilder.create("dunes-script-module", xmlOptions);
    const root = elementInfoXml;
    root.att("name", name)
        .att("result-type", action.returnType.type)
        .att("api-version", "6.0.0")
        .att("id", id)
        .att("version", action.version || "1.0.0")
        .att("allowed-operations", "vef");
    root.ele("description").cdata(description); // Check if that is correct to be put here.
    if (action?.runtime?.lang != null && action?.runtime?.lang != t.Lang.javascript) {
        root.ele("runtime").cdata(`${t.Lang[action.runtime.lang] }:${ action.runtime.version}`);
    }
    if (action?.bundle != null) {
        root.ele("entry-point").cdata(action.bundle.entry);
    }
    action.params.forEach(param => {
        root.ele("param").att("n", param.name).att("t", param.type).cdata(param.description);
    });
    if (actioncontent != null && (action.bundle == null || actioncontent.trim() != "") ) {
        root.ele("script").att("encoded", "false").cdata(actioncontent);
    }
    return elementInfoXml.end(saveOptions);
}

export const complexActionComment = (element: t.VroNativeElement) => {
    if (element?.type != t.VroElementType.ScriptModule) {
        return element?.comment;
    }
    const obj : any = {
        comment: element?.comment,
        returnType:  element.action.returnType,
        javadoc: element.action?.inline?.javadoc,
        crc: null
    };
    obj.crc = (CRC.str(JSON.stringify(obj))& 0x7FFFFFFF).toString(16);
    return JSON.stringify(obj, null, 2);
}
