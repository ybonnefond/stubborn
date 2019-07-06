"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function headerMatcher(route) {
    return (req) => {
        const headersDefinition = route.getHeaders();
        if (null === headersDefinition) {
            return true;
        }
        const { headers: rawHeaders } = req;
        const keyMap = new utils_1.KeyMap(headersDefinition, { caseSensitive: false });
        // Filter headers where def has null for value
        const headers = keyMap.filterExcluded(rawHeaders);
        function compare(defValue, reqValue) {
            if ('string' !== typeof reqValue) {
                return false;
            }
            return utils_1.match(defValue, reqValue);
        }
        return keyMap.compareIncluded(headers, compare);
    };
}
exports.headerMatcher = headerMatcher;
//# sourceMappingURL=HeaderMatcher.js.map