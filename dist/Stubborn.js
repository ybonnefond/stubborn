"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const Router_1 = require("./Router");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class Stubborn {
    /**
     * @class Stubborn
     * @example
     * ```js
     * const { Stubborn } = require('stubborn-ws');
     * const stb = new Stubborn();
     * ```
     */
    constructor(options = {}) {
        this.options = Object.assign({
            host: 'localhost',
            defaultHeaders: {},
        }, options);
        this.port = null;
        this.server = http_1.createServer();
        this.router = new Router_1.Router({ host: this.options.host });
    }
    /**
     * Returns the server port.
     *
     * If the server is initialized with options.port set to 0 this method
     * will return the randomly affected port only after the server is started
     * @returns {number | null} Listening port or null if the server is not started
     */
    getPort() {
        return utils_1.getServerPort(this.server);
    }
    /**
     * Returns the server origin (http://<options.host>:<port>)
     * @returns {string}
     */
    getOrigin() {
        return `http://${this.options.host}:${this.getPort()}`;
    }
    /**
     * Remove all routes from the server
     *
     * @returns {this}
     */
    clear() {
        this.router.clear();
        return this;
    }
    /**
     * Create and Register a new DELETE route
     *
     * @param {string} path Stubbed resource path
     * @returns {Route}
     */
    delete(path) {
        return this.router.createRoute(constants_1.METHODS.DELETE, path).setBody(null);
    }
    /**
     * Create and Register a new GET route
     *
     * @param {string} path Stubbed resource path
     * @returns {Route}
     */
    get(path) {
        return this.router.createRoute(constants_1.METHODS.GET, path).setBody(null);
    }
    /**
     * Create and Register a new PACH route
     *
     * @param {string} path Stubbed resource path
     * @param {RequestBodyDefinition} body Expected request body
     * @returns {Route}
     */
    patch(path, body = '') {
        return this.router.createRoute(constants_1.METHODS.PATCH, path).setBody(body);
    }
    /**
     * Create and Register a new POST route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    post(path, body = '') {
        return this.router.createRoute(constants_1.METHODS.POST, path).setBody(body);
    }
    /**
     * Create and Register a new PUT route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    put(path, body = '') {
        return this.router.createRoute(constants_1.METHODS.PUT, path).setBody(body);
    }
    /**
     * Start the Stubborn server
     *
     * @returns {Promise} Promise object resolved when server is started
     */
    start(port = 0) {
        this.port = port;
        return new Promise(resolve => {
            this.server.listen(this.port);
            this.router.handle(this.server);
            resolve();
        });
    }
    /**
     * Stop the Stubborn server
     *
     * @returns {Promise} Promise object resolved when server is stopped
     */
    stop() {
        return new Promise(resolve => {
            this.server.close(() => resolve());
        });
    }
}
exports.Stubborn = Stubborn;
//# sourceMappingURL=Stubborn.js.map