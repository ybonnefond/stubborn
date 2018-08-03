'use strict';

const { URL: Url } = require('url');

module.exports = (options) => {
    return function urlParserMiddleware(req, res, next) {
        const parsedUrl = new Url(req.url, `http://${options.host}:${options.port}/`);
        req.path = parsedUrl.pathname;
        req.searchParams = parsedUrl.searchParams;
        req.query = convertSearchParamsToQuery(parsedUrl.searchParams.entries());
        req.hash = parsedUrl.hash;

        next();
    };
};

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
