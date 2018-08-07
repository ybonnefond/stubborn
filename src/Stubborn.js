'use strict';

const http = require('http');
const Router = require('./Router');
const { METHODS } = require('./constants');

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
            port: 8080,
            host: 'localhost',
            defaultHeaders: {}
        }, options);

        this.server = http.createServer();
        this.router = new Router({ host: this.options.host, port: this.options.port });
        this.router.handle(this.server);
    }

    /**
     * Returns the server port.
     *
     * If the server is initialized with options.port set to 0 this method
     * will return the randomly affected port only after the server is started
     * @returns {number} Listening port
     */
    getPort() {
        if (0 === this.options.port) {
            const address = this.server.address();

            if (null !== address) {
                return address.port;
            }
        }

        return this.options.port;
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
        return this.router
            .createRoute(METHODS.DELETE, path)
            .setBody(null);
    }

    /**
     * Create and Register a new GET route
     *
     * @param {string} path Stubbed resource path
     * @returns {Route}
     */
    get(path) {
        return this.router
            .createRoute(METHODS.GET, path)
            .setBody(null);
    }

    /**
     * Returns the server origin (http://<options.host>:<port>)
     * @returns {string}
     */
    getOrigin() {
        return `http://${this.options.host}:${this.getPort()}`;
    }

    /**
     * Create and Register a new PACH route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    patch(path, body = '') {
        return this.router
            .createRoute(METHODS.PATCH, path)
            .setBody(body);
    }

    /**
     * Create and Register a new POST route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    post(path, body = '') {
        return this.router
            .createRoute(METHODS.POST, path)
            .setBody(body);
    }

    /**
     * Create and Register a new PUT route
     *
     * @param {string} path Stubbed resource path
     * @param {string|object} body Expected request body
     * @returns {Route}
     */
    put(path, body = '') {
        return this.router
            .createRoute(METHODS.PUT, path)
            .setBody(body);
    }

    /**
     * Start the Stubborn server
     *
     * @returns {Promise} Promise object resolved when server is started
     */
    start() {
        return new Promise((resolve) => {
            this.server.listen(this.options.port);
            this.router.setPort(this.getPort());
            resolve();
        });
    }

    /**
     * Stop the Stubborn server
     *
     * @returns {Promise} Promise object resolved when server is stopped
     */
    stop() {
        return new Promise((resolve) => {
            this.server.close(() => resolve());
        });
    }
}

module.exports = Stubborn;
