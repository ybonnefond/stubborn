"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function urlParser(options) {
    return function urlParserMiddleware(req, _, next) {
        const parsedUrl = new url_1.URL(req.url, `http://${options.host}:${options.port}/`);
        req.path = parsedUrl.pathname;
        req.searchParams = parsedUrl.searchParams;
        req.query = convertSearchParamsToQuery(parsedUrl.searchParams.entries());
        req.hash = parsedUrl.hash;
        next();
    };
}
exports.urlParser = urlParser;
function convertSearchParamsToQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams) {
        if (key in query) {
            // Convert to array if there are multiple value for the query parameter
            if (!Array.isArray(query[key])) {
                query[key] = [query[key]];
            }
            query[key].push(value);
        }
        query[key] = value;
    }
    return query;
}
//# sourceMappingURL=urlParser.js.map