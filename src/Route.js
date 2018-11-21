'use strict';

const { STATUS_CODES } = require('./constants');

class Route {
    /**
     * @class Route
     */
    constructor(method, path) {
        this.method = method;
        this.path = path;
        this.headers = {};
        this.query = {};
        this.body = '';

        this.setHeaders({
            'user-agent': null,
            'accept-encoding': null,
            accept: null,
            'content-length': null,
            host: null,
            connection: null
        });

        this.setQueryParameters({});

        this.response = {
            statusCode: STATUS_CODES.SUCCESS,
            headers: {
                'Content-Type': '{{headers.accept}}'
            },
            body: null
        };
    }

    /**
     * Return the route definition, helpful to find why the route didn't match the request
     *
     * @returns {RouteDefinition}
     */
    getDefinition() {
        return {
            method: this.method,
            path: this.path,
            headers: this.headers,
            query: this.query,
            body: this.body
        };
    }

    /**
     * Set the headers definition.
     *
     * @example
     * ```js
     * // Bypass all headers
     * stubborn
     *   .get('/bypass')
     *   .setHeaders(null);
     *
     * stubborn
     *   .get('/match')
     *   .setHeaders({
     *     // Match using `===`
     *     exact: 'match',
     *     // Match using `/^match/.test(value)`
     *     regexp: /^match/,
     *     // Match using `func(value);`
     *     func: (value) => 'match' === value
     *   });
     * ```
     * @param {HeadersDefinition|null} headers Headers definition
     * @returns {this}
     */
    setHeaders(headers) {
        this.headers = null === headers ? headers : Object.assign({}, this.headers, headers);

        return this;
    }

    /**
     * Set a specific header definition.
     *
     * @example
     * ```js
     *
     * stubborn
     *   .get('/match')
     *   .setHeader('Authorization', 'BEARER');
     * ```
     * @param {String} header Header name
     * @param {Definition} definition Header definition
     * @returns {this}
     */
    setHeader(header, definition) {
        this.headers[header] = definition;

        return this;
    }

    /**
     * Set the headers definition.
     *
     * @example
     * ```js
     * // Bypass all query parameters
     * stubborn
     *   .get('/bypass')
     *   .setQueryParameters(null);
     *
     * stubborn
     *   .get('/match')
     *   .setQueryParameters({
     *     // Match using `===`
     *     exact: 'match',
     *     // Match using `/^match/.test(value)`
     *     regexp: /^match/,
     *     // Match using `func(value);`
     *     func: (value) => 'match' === value
     *   });
     * ```
     * @param {QueryParametersDefinition|null} query Query parameters definition
     * @returns {this}
     */
    setQueryParameters(query) {
        this.query = null === query ? query : Object.assign({}, this.query, query);

        return this;
    }

    /**
     * Set a specific query parameter
     *
     * @example
     * ```js
     * stubborn
     *   .get('/match')
     *   .setQueryParameter('page', '100');
     * ```
     * @param {String} queryParameter Query parameters name
     * @param {Definition} definition Query parameter definition
     * @returns {this}
     */
    setQueryParameter(queryParameter, definition) {
        this.query[queryParameter] = definition;

        return this;
    }

    /**
     * Set the body definition. Body can be a string or a complex object mixing
     *
     * @example
     * ```js
     * // Bypass all query parameters
     * stubborn
     *   .get('/bypass')
     *   .setBody(null);
     *
     * stubborn
     *   .get('/simple')
     *   .setBody('text body');
     *
     * stubborn
     *   .get('/object')
     *   .setBody({
     *     // Match using `===`
     *     exact: 'match',
     *     // Match using `/^match/.test(value)`
     *     regexp: /^match/,
     *     // Match using `func(value);`
     *     func: (value) => 'match' === value,
     *     object: { reg: /\d+/, bypass: null },
     *     arr: [{ item: '1' }, { item: /2/ }]
     *   });
     * ```
     * @param {BodyDefinition} body Body definition
     * @returns {this}
     */
    setBody(body) {
        this.body = body;

        return this;
    }

    /**
     * Set the response status code
     * @param {Number} statusCode HTTP status code
     * @returns {this}
     */
    setResponseStatusCode(statusCode) {
        this.response.statusCode = statusCode;

        return this;
    }

    /**
     * Set the response body
     *
     * If response is an Object, values can be a function which will receive the request as parameter
     *
     * @example
     * ```js
     * ws.get('/resource')
     *   .setResponseBody({
     *     key: 'value',
     *     funKey: (req) => `${req.query.param}-param`
     *   });
     * ```
     * @param {string|Object.<string, mixed>} body
     * @returns {this}
     */
    setResponseBody(body) {
        this.response.body = body;

        return this;
    }

    /**
     * Set the response headers
     * key/value object. If value is a function it will receive the request as parameter
     * ```js
     * ws.get('/resource')
     *   .setResponseHeaders({
     *     'Content-type': 'application/json',
     *     'Custom-Header': (req) => `${req.header.custom}-response`
     *   });
     * ```
     * @param {Object.<mixed>} headers
     * @returns {this}
     */
    setResponseHeaders(headers) {
        this.response.headers = headers;

        return this;
    }

    /**
     * Set a response header
     *
     * ```js
     * ws.get('/resource')
     *   .setResponseHeader('Content-type', 'application/json');
     * ```
     * @param {String} header
     * @param {String|function} value
     * @returns {this}
     */
    setResponseHeader(header, value) {
        this.response.headers[header] = value;

        return this;
    }
}

module.exports = Route;

/**
 * @typedef {Object} RouteDefinition
 * @property {string} method The route method, one of [GET, POST, PATCH, PUT, DELETE]
 * @property {string} path The stubbed resource path (ex: /users)
 * @property {HeadersDefinition} headers
 * @property {QueryParametersDefinition} query
 * @property {BodyDefinition} body
 */

/**
  * Definition
  * The header definition can be a `string`, a `Regexp`, a `function` or `null`
  * - `string`: Match using string equality against the request header value
  * - `Regexp`: Match using Regexp.test against the request header value
  * - `function`: Request header value will be passed to the function. The function Should return a boolean
  * - `null`: act as a wildcard, header will not be processed
  * @typedef {string|Regexp|function|null} Definition

/**
  * key/value object. Key is the header name, value is the header definition
  * The header definition can be a `string`, a `Regexp`, a `function` or `null`
  * - `string`: Match using string equality against the request header value
  * - `Regexp`: Match using Regexp.test against the request header value
  * - `function`: Request header value will be passed to the function. The function Should return a boolean
  * - `null`: act as a wildcard, header will not be processed
  * @typedef {object.<string, HeaderValue>} HeadersDefinition
  */

/**
  * key/value object. Key is the query parameter name, value is the parameter definition
  * The parameter definition can be a `string`, a `Regexp`, a `function` or `null`
  * - `string`: Match using string equality against the request parameter value
  * - `Regexp`: Match using Regexp.test against the request parameter value
  * - `function`: Request parameter value will be passed to the function. The function Should return a boolean
  * - `null`: act as a wildcard, parameter will not be processed
  *
  * @typedef {Object.<string, Definition>} QueryParametersDefinition
  */

/**
  * Body can be a string, an array or a key/mixed object where values can be a `string`, a `Regexp`, a `function`, object, Array or `null`
  * - `string`: Match using string equality against the request parameter value
  * - `Regexp`: Match using Regexp.test against the request parameter value
  * - `function`: Request parameter value will be passed to the function. The function Should return a boolean
  * - `Object`: Object will be recursively processed.
  * - `Array`: Each array items will be recursively processed
  * - `null`: act as a wildcard, parameter will not be processed
  *
  * @typedef {string|Array|Object.<string, Definition|Body>} BodyDefinition
  */
