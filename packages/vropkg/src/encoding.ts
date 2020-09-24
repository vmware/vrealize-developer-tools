/*!
 * Copyright 2018-2020 VMware, Inc.
 * SPDX-License-Identifier: MIT
 */
const Iconv = require('iconv').Iconv;

export const decode = (buf: Buffer): string => {
    let encoding;
    let strip = 0;
    if (buf.length > 3 && buf[0] == 0x00 && buf[1] == 0x00 && buf[2] == 0xFE && buf[3] == 0xFF) { // UTF-32 (BE)
        encoding = "UTF-32BE";
        strip = 4;
    } else if (buf.length > 3 && buf[0] == 0xFF && buf[1] == 0xFE && buf[2] == 0x00 && buf[3] == 0x00) { // UTF-32 (LE)
        encoding = "UTF-32LE";
        strip = 4;
    } else if (buf.length > 1 && buf[0] == 0xFE && buf[1] == 0xFF) { // UTF-16 (BE)
        encoding = "UTF-16BE";
        strip = 2;
    } else if (buf.length > 1 && buf[0] == 0xFF && buf[1] == 0xFE) { // UTF-16 (LE)
        encoding = "UTF-16LE";
        strip = 2;
    } else if (buf.length > 2 && buf[0] == 0xEF && buf[1] == 0xBB && buf[2] == 0xBF) { // UTF-8
        encoding = "UTF-8";
        strip = 3;
    } else if (buf.length > 3 && buf[0] == 0x2B && buf[1] == 0x2F && buf[2] == 0x76
        && (buf[3] == 0x38 || buf[3] == 0x39 || buf[3] == 0x2B || buf[3] == 0x2F)) {
        encoding = "UTF-7";
        strip = 4;
    } else if (buf.length > 4 && buf[0] == 0x2B && buf[1] == 0x2F && buf[2] == 0x76 && buf[3] == 0x38 && buf[4] == 0x2D) {
        encoding = "UTF-7";
        strip = 5;
    } else {
        let str = "";
        for (const item of buf) {
            str += String.fromCharCode(item);
        }
        return str;
    }
    const iconv = new Iconv(encoding, "UTF-8");
    return iconv.convert(buf.slice(strip)).toString("UTF-8");
}
