"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function queryMatcher(route) {
    return (req) => {
        const definition = route.getQueryParameters();
        if (null === definition) {
            return true;
        }
        const def = formatDef(definition);
        const { query: rawQuery } = req;
        const formatedQuery = formatDef(rawQuery);
        const keyMap = new utils_1.KeyMap(def);
        const query = keyMap.filterExcluded(formatedQuery);
        function compare(defValues, reqValues) {
            if (!Array.isArray(reqValues)) {
                return false;
            }
            return reqValues.every(reqValue => {
                return defValues.some((defValue) => {
                    return utils_1.match(defValue, reqValue);
                });
            });
        }
        return keyMap.compareIncluded(query, compare);
    };
}
exports.queryMatcher = queryMatcher;
function formatDef(rawDef) {
    return Object.keys(rawDef).reduce((def, key) => {
        const rawValue = rawDef[key];
        const value = null === rawValue || Array.isArray(rawValue) ? rawValue : [rawValue];
        def[key] = value;
        return def;
    }, {});
}
//# sourceMappingURL=QueryMatcher.js.map