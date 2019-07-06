"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accept_1 = __importDefault(require("accept"));
const content_type_1 = __importDefault(require("content-type"));
const constants_1 = require("./constants");
const Route_1 = require("./Route");
const RouteMatcher_1 = require("./RouteMatcher");
const middlewares_1 = require("./middlewares");
const utils_1 = require("./utils");
class Router {
    constructor(options) {
        this.port = null;
        this.routes = new Set();
        this.options = Object.assign({
            host: '',
        }, options);
    }
    createRoute(method, path) {
        const route = new Route_1.Route(method, path);
        const matcher = new RouteMatcher_1.RouteMatcher(route);
        this.routes.add({ route, matcher });
        return route;
    }
    clear() {
        this.routes.clear();
    }
    handle(server) {
        this.port = utils_1.getServerPort(server);
        const mws = buildMiddlewares(this);
        mws.push(buildRequestHandler(this));
        server.on('request', (req, res) => {
            return runMiddlewares(mws.slice(0), req, res);
        });
    }
    getRoutes() {
        return this.routes;
    }
    getHost() {
        return this.options.host;
    }
    getPort() {
        return this.port;
    }
}
exports.Router = Router;
function runMiddlewares(mws, req, res) {
    if (mws.length === 0) {
        return Promise.resolve();
    }
    const mw = mws.shift();
    return runMiddleware(mw, req, res).then(() => runMiddlewares(mws, req, res));
}
function runMiddleware(mw, req, res) {
    return new Promise((resolve, reject) => {
        try {
            mw(req, res, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
function buildRequestHandler(router) {
    return (req, res, next) => {
        const route = findRoute(router.getRoutes(), req);
        if (null === route) {
            replyNotImplemented(res, req);
        }
        else {
            reply(route, res, req);
        }
        next();
    };
}
function buildMiddlewares(router) {
    return [
        middlewares_1.middlewares.urlParser({ host: router.getHost(), port: router.getPort() }),
        middlewares_1.middlewares.bodyJson(),
        middlewares_1.middlewares.bodyUrlEncoded(),
        middlewares_1.middlewares.bodyRaw(),
    ];
}
function findRoute(routes, req) {
    for (const [{ route, matcher }] of routes.entries()) {
        if (matcher.match(req)) {
            return route;
        }
    }
    return null;
}
function reply(route, res, req) {
    const stripedReq = stripReq(req);
    route.addCall(stripedReq);
    const headers = applyTemplate(route.getResponseHeaders(), req);
    const body = applyTemplate(route.getResponseBody(), req);
    res.writeHead(route.getResponseStatusCode(), headers);
    res.write(encodeBody(req, headers, body));
    res.end();
}
function replyNotImplemented(res, req) {
    res.writeHead(constants_1.STATUS_CODES.NOT_IMPLEMENTED, {
        'Content-Type': 'application/json',
    });
    res.write(JSON.stringify({
        message: 'No route matched',
        request: {
            method: req.method,
            path: req.path,
            headers: req.headers,
            query: req.query,
            body: req.body,
        },
    }, null, 2));
    res.end();
}
function encodeBody(req, headers, body) {
    const mediaType = findContentType(headers);
    const mediaTypes = null === mediaType ? findAcceptTypes(req.headers) : [mediaType];
    if (mediaTypes.includes('application/json')) {
        return JSON.stringify(body, null, 2); // eslint-disable-line no-magic-numbers
    }
    return body;
}
function stripReq(req) {
    const { headers, body, path, query, hash, method } = req;
    return {
        headers,
        body,
        path,
        query,
        hash,
        method,
    };
}
function findAcceptTypes(headers) {
    const headerKey = Object.keys(headers).find(name => new RegExp('^accept$', 'i').test(name));
    return 'undefined' === typeof headerKey
        ? []
        : accept_1.default.mediaTypes(headers[headerKey]);
}
function findContentType(headers) {
    const headerKey = Object.keys(headers).find(name => new RegExp('^content-type$', 'i').test(name));
    if ('undefined' === typeof headerKey) {
        return null;
    }
    const headerValue = headers[headerKey];
    if ('string' !== typeof headerValue) {
        return null;
    }
    try {
        return content_type_1.default.parse(headerValue).type;
    }
    catch (e) {
        return null;
    }
}
function applyTemplate(template, req, scope) {
    if (null === template || 'undefined' === typeof template) {
        return '';
    }
    if (Array.isArray(template)) {
        return template.map(item => {
            return applyTemplate(item, req, scope);
        });
    }
    const type = typeof template;
    switch (type) {
        case 'function':
            return template(req, scope);
        case 'object':
            return Object.keys(template).reduce((obj, key) => {
                obj[key] = applyTemplate(template[key], req, template);
                return obj;
            }, {});
        case 'symbol':
            return String(template).replace(/^Symbol\((.*)\)$/, '$1');
        default:
            return template;
    }
}
//# sourceMappingURL=Router.js.map