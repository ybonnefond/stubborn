"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var METHODS;
(function (METHODS) {
    METHODS["GET"] = "GET";
    METHODS["POST"] = "POST";
    METHODS["PUT"] = "PUT";
    METHODS["PATCH"] = "PATCH";
    METHODS["DELETE"] = "DELETE";
})(METHODS = exports.METHODS || (exports.METHODS = {}));
var STATUS_CODES;
(function (STATUS_CODES) {
    // 2xx Success
    STATUS_CODES[STATUS_CODES["SUCCESS"] = 200] = "SUCCESS";
    // 5xx Server Errors
    STATUS_CODES[STATUS_CODES["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
})(STATUS_CODES = exports.STATUS_CODES || (exports.STATUS_CODES = {}));
//# sourceMappingURL=constants.js.map