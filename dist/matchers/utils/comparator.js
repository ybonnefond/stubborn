"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { isEqualWith: isEqual } = require('lodash');
function match(def, value) {
    return isEqual(def, value, customizer);
}
exports.match = match;
function customizer(def, value) {
    // eslint-disable-line consistent-return
    if (def instanceof RegExp) {
        return def.test(String(value));
    }
    if ('function' === typeof def) {
        return def(value);
    }
}
//# sourceMappingURL=comparator.js.map