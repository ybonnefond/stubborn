'use strict';

const { STATUS_CODES } = require('./constants');
const Route = require('./Route');
const RouteMatcher = require('./RouteMatcher');
const middlewares = require('./middlewares');

class Router {
    constructor(options) {
        this.options = Object.assign({
            host: '',
            port: 0
        }, options);

        this.port = this.options.port;
        this.routes = new Set();

        this.middlewares = [];

        this.notImplemented = new Route()
            .setResponseHeaders({ 'Content-Type': 'application/json' })
            .setResponseStatusCode(STATUS_CODES.NOT_IMPLEMENTED)
            .setResponseBody((req) => {
                return {
                    message: 'No route matched',
                    request: {
                        method: req.method,
                        path: req.path,
                        headers: req.headers,
                        query: req.query,
                        body: req.body
                    }
                };
            });
    }

    createRoute(method, path) {
        const route = new Route(method, path);
        const matcher = new RouteMatcher(route);
        this.routes.add({ route, matcher });

        return route;
    }

    clear() {
        this.routes.clear();
    }

    setPort(port) {
        this.port = port;

        return this;
    }

    handle(server) {
        const mws = buildMiddlewares(this);
        mws.push(buildRequestHandler(this));
        server.on('request', (req, res) => {
            return runMiddlewares(mws.slice(0), req, res);
        });
    }
}

function runMiddlewares(mws, req, res) {
    if (mws.length === 0) {
        return Promise.resolve();
    }

    const mw = mws.shift();

    return runMiddleware(mw, req, res)
        .then(() => {
            return runMiddlewares(mws, req, res);
        });
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
        } catch (err) {
            reject(err);
        }
    });
}

function buildRequestHandler(router) {
    return (req, res, next) => {
        const route = findRoute(router.routes, req) || router.notImplemented;

        reply(route, res, req);

        next();
    };
}

function buildMiddlewares(router) {
    return [
        middlewares.urlParser({ host: router.options.host, port: router.port }),
        middlewares.bodyJson(),
        middlewares.bodyUrlEncoded({ extended: true }),
        middlewares.bodyRaw({ type: () => true })
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
    res.writeHead(route.response.statusCode, applyTemplate(route.response.headers, req));
    const body = applyTemplate(route.response.body, req);
    res.write(JSON.stringify(body, null, 2)); // eslint-disable-line no-magic-numbers
    res.end();
}

function applyTemplate(template, req, scope) {
    if (null === template || 'undefined' === typeof template) {
        return '';
    }

    if (Array.isArray(template)) {
        return template.map((item) => {
            return applyTemplate(item, req, scope);
        });
    }

    const type = typeof template;

    switch (type) {
        case 'function':
            return template(req, scope);
        case 'object': return Object
            .keys(template)
            .reduce((obj, key) => {
                obj[key] = applyTemplate(template[key], req, template);
                return obj;
            }, {});
        case 'symbol': return String(template).replace(/^Symbol\((.*)\)$/, '$1');

        default:
            return template;
    }
}

module.exports = Router;
