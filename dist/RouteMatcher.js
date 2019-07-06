"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchers_1 = require("./matchers");
class RouteMatcher {
    constructor(route) {
        this.matchers = [];
        this.matchers = Object.values(matchers_1.matchers).map(matcher => {
            return matcher(route);
        });
    }
    match(req) {
        return this.matchers.every(matcher => {
            return matcher(req);
        });
    }
}
exports.RouteMatcher = RouteMatcher;
//# sourceMappingURL=RouteMatcher.js.map