'use strict';

const http = require('http');
const Router = require('./Router');
const { METHODS } = require('./constants');

class HttpServer {
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

    getPort() {
        if (0 === this.options.port) {
            const address = this.server.address();

            if (null === address) {
                throw new Error('Server must be started to get a random port');
            }

            return address.port;
        }

        return this.options.port;
    }

    getOrigin() {
        return `http://${this.options.host}:${this.getPort()}`;
    }

    get(path) {
        return this.router
            .createRoute(METHODS.GET, path)
            .setBody(null);
    }

    post(path, body = '') {
        return this.router
            .createRoute(METHODS.POST, path)
            .setBody(body);
    }

    put(path, body = '') {
        return this.router
            .createRoute(METHODS.PUT, path)
            .setBody(body);
    }

    patch(path, body = '') {
        return this.router
            .createRoute(METHODS.PATCH, path)
            .setBody(body);
    }

    delete(path) {
        return this.router
            .createRoute(METHODS.DELETE, path)
            .setBody(null);
    }

    clear() {
        this.router.clear();

        return this;
    }

    start() {
        return new Promise((resolve) => {
            this.server.listen(this.options.port);
            this.router.setPort(this.getPort());
            resolve();
        });
    }

    stop() {
        return new Promise((resolve) => {
            this.server.close(() => resolve());
        });
    }
}

module.exports = HttpServer;
