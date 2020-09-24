/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
import crypto from "crypto"

import * as fs from "fs-extra"
import * as nforge from "node-forge"
import * as winston from "winston"

import * as t from "./types"

/**
 * loadCertificate the private key and corresponding certificate chain (from files) and return a
 * t.Certificate object containing the given private key and certificate chain together
 * with a subject to certificate mapping for easy search.
 *
 * Note 1: if privateKey and/or chain is a valid path to existing and readable file, then
 * the contain of that file will be assumed to contain the actual key/certificate chain.
 * Otherwise privateKey and/or chain will be assumed to contain the actual raw key and/or
 * certificate chain (in PEM format).
 *
 * Note 2: No actual check will be done whether the certificate chain actually corresponds
 * to the given private key or anything like that.
 * Private key if encrypted with a password will not be decrypted and will remain in
 * encrypted form.
 *
 * @param {chain} A path to a file containing certificate chain of concatenated certificates
 * in PEM format or a raw string containing the concatenated PEM certificates.
 * @param {privateKey} A path to a file containing the private key in PEM format or the raw PEM
 * content of the key otherwise. Private key may be encrypted using a password
 * in which case it would not be decrypted.
 * @param {privateKeyPassword} a {privateKey} passphrase
 * @return {t.Certificate} object representing the private key,
 * certificate chain together with a Subject to Certificate map for easier search.
 */
const loadCertificate = (chain: t.PEM, privateKey: t.PEM, privateKeyPassword: string): t.Certificate => {
    const privateKeyPEM = getContentIfFile(privateKey)
    const chainPEMs = extractPEMs(getContentIfFile(chain))

    if (!privateKeyPEM) {
        throw Error("No certificate chain provided.")
    }
    if (chainPEMs.length == 0) {
        throw Error("No certificate chain provided.")
    }

    const publicKeyPEM = chainPEMs[chainPEMs.length - 1]

    const subjectPEMChainMap: Map<t.SUBJECT, t.PEM> = new Map()
    chainPEMs.forEach(pem => {
        subjectPEMChainMap.set(getSubject(pem), pem)
    })

    return {
        subject: getSubject(publicKeyPEM),
        privateKey: privateKeyPEM,
        privateKeyPassword: privateKeyPassword,
        publicKey: publicKeyPEM,
        chain: subjectPEMChainMap
    } as t.Certificate
}

/**
 * Gets a certificate chain of concatenated certificates in PEM format, and returns an array of
 * certificates again in PEM format that are extracted from the original concatenated content.
 * @param pemOfPEMs One or more certificates in PEM format concatenated together.
 * @return An array of certificates in PEM format that correspond to the same certificates that have been
 *         available in the original concatenated input.
 */
const extractPEMs = (pemOfPEMs: t.PEM): t.PEM[] => {
    const BOUNDARY_BEGIN = "-----BEGIN CERTIFICATE-----"
    const BOUNDARY_END = "-----END CERTIFICATE-----"
    const NEW_LINE = /[\n\r]/

    let store = false
    let body: string[] = []

    const pems: t.PEM[] = []

    const lines = pemOfPEMs.toString().split(NEW_LINE)
    for (const line of lines) {
        switch (line) {
            case BOUNDARY_BEGIN:
                store = true
                body.push(BOUNDARY_BEGIN)
                break
            case BOUNDARY_END:
                store = false
                body.push(BOUNDARY_END)
                pems.push(body.join("\n\r") as t.PEM)
                body = []
                break
            default:
                if (store) {
                    body.push(line)
                }
        }
    }
    return pems
}

/**
 * Checks if the input string is a a represenation of a path to an existing file and if so,
 * then returns the file content, otherwise it would return the input unchanged.
 *
 * @param pem A path ot an existing and readable file that contains a cert/key or a valid cert/key content otherwise.
 * @return {t.PEM}
 */
const getContentIfFile = (pem: t.PEM | string): t.PEM => {
    if (pem == undefined || pem == null) {
        return pem
    }
    if (fs.existsSync(pem) && fs.lstatSync(pem).isFile()) {
        winston.loggers.get("vrbt").info(`Using certificate file ${pem}`)
        return fs.readFileSync(pem, "utf-8") as t.PEM
    }
    winston.loggers.get("vrbt").info(`Using certificate PEM from console input`)
    return pem
}

/**
 * Extract the subject form a certificate in PEM format.
 * This does the same as
 * `openssl x509 -in cert.pem -text | grep Subject:`
 *
 * @param certificate A certificate in PEM format.
 * @return The subject of the certificate.
 *    Example: "C=BG, ST=Bulgaria, L=Sofia, O=VMware, OU=PSCoE, CN=yordan/emailAddress=ipetrov@vmware.com"
 */
const getSubject = (certificate: t.PEM): string => {
    return nforge.pki
        .certificateFromPem(certificate)
        .subject.attributes.map(attr => [attr.shortName, attr.value].join("="))
        .join(",")
}

/**
 * Sign the {data} with a certificate private key and store it at an optional location {exportFilePath}
 *
 * @param data
 * @param certificate
 * @param exportFilePath
 */
const sign = (data: string | Buffer, certificate: t.Certificate): Buffer => {
    const signer = crypto.createSign("MD5")
    signer.update(data)
    signer.end()
    return signer.sign(
        crypto.createPrivateKey({
            key: certificate.privateKey,
            format: "pem",
            passphrase: certificate.privateKeyPassword
        })
    )
}

/**
 * Get a PEM encoded certificate or key, strip the header and trailer delimiters and then Base 64 decode the content to obtain
 * the raw DER encoded content of the key or certificate and rerurn it as a Buffer object.
 *
 * @param pem A string containing the PEM encoded certificate or key.
 * @return The raw DER encoded certificate or key.
 */
const pemToDer = (pem: t.PEM): Buffer => {
    const b64 = pem
        .toString()
        .replace(/[\n\r]/g, "")
        .replace(/.*-----BEGIN CERTIFICATE-----/, "")
        .replace(/-----END CERTIFICATE-----/, "")
        .replace(/.*-----BEGIN ENCRYPTED PRIVATE KEY-----/, "")
        .replace(/-----END ENCRYPTED PRIVATE KEY-----/, "")
    return Buffer.from(b64, "base64")
}

export { loadCertificate, sign, pemToDer }
