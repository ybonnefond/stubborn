"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyJson_1 = require("./bodyJson");
const bodyUrlEncoded_1 = require("./bodyUrlEncoded");
const bodyRaw_1 = require("./bodyRaw");
const urlParser_1 = require("./urlParser");
exports.middlewares = {
    bodyJson: bodyJson_1.bodyJson,
    bodyUrlEncoded: bodyUrlEncoded_1.bodyUrlEncoded,
    bodyRaw: bodyRaw_1.bodyRaw,
    urlParser: urlParser_1.urlParser,
};
//# sourceMappingURL=index.js.map