'use strict';

const { STATUS_CODES } = require('./constants');

class Route {
    constructor(method, path) {
        this.method = method;
        this.path = path;
        this.headers = {};
        this.query = {};
        this.body = '';

        this.addHeaders({
            'user-agent': null,
            'accept-encoding': null,
            accept: null,
            'content-length': null,
            host: null,
            connection: null
        });

        this.addQuery({});

        this.response = {
            statusCode: STATUS_CODES.SUCCESS,
            headers: {
                'Content-Type': '{{headers.accept}}'
            },
            body: null
        };
    }

    getDefinition() {
        return {
            method: this.method,
            path: this.path,
            headers: this.headers,
            query: this.query,
            body: this.body
        };
    }

    addHeaders(headers) {
        this.headers = Object.assign({}, this.headers, headers);

        return this;
    }

    addQuery(query) {
        this.query = Object.assign({}, this.query, query);

        return this;
    }

    setBody(body) {
        this.body = body;

        return this;
    }

    setResponseStatusCode(statusCode) {
        this.response.statusCode = statusCode;

        return this;
    }

    setResponseBody(body) {
        this.response.body = body;

        return this;
    }

    setResponseHeaders(headers) {
        this.response.headers = headers;

        return this;
    }
}

module.exports = Route;
