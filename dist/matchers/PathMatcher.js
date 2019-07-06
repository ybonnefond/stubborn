"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function pathMatcher(route) {
    return (req) => {
        const { path } = req;
        return utils_1.match(route.getPath(), path);
    };
}
exports.pathMatcher = pathMatcher;
//# sourceMappingURL=PathMatcher.js.map