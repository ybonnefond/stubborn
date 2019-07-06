"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function methodMatcher(route) {
    return (req) => {
        const { method } = req;
        return utils_1.match(route.getMethod(), method);
    };
}
exports.methodMatcher = methodMatcher;
//# sourceMappingURL=MethodMatcher.js.map