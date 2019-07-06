"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function bodyMatcher(route) {
    return (req) => {
        const { body: rawBody } = req;
        const body = rawBody instanceof Buffer ? String(rawBody) : rawBody;
        const bodyDefinition = route.getBody();
        // Bypass body matching
        if (null === bodyDefinition) {
            return true;
        }
        return utils_1.match(bodyDefinition, body);
    };
}
exports.bodyMatcher = bodyMatcher;
//# sourceMappingURL=BodyMatcher.js.map