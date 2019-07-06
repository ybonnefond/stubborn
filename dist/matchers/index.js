"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HeaderMatcher_1 = require("./HeaderMatcher");
const MethodMatcher_1 = require("./MethodMatcher");
const PathMatcher_1 = require("./PathMatcher");
const QueryMatcher_1 = require("./QueryMatcher");
const BodyMatcher_1 = require("./BodyMatcher");
exports.matchers = {
    headerMatcher: HeaderMatcher_1.headerMatcher,
    methodMatcher: MethodMatcher_1.methodMatcher,
    pathMatcher: PathMatcher_1.pathMatcher,
    queryMatcher: QueryMatcher_1.queryMatcher,
    bodyMatcher: BodyMatcher_1.bodyMatcher,
};
//# sourceMappingURL=index.js.map