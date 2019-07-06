import { RequestInfo, RequestBodyDefinition, HeaderDefinitions, QueryDefinitions, RequestDefinition, JsonValue, PathDefinition } from './@types';
import { METHODS } from './constants';
export declare class Route {
    private method;
    private path;
    private body;
    private headers;
    private query;
    private response;
    private calls;
    /**
     * @class Route
     */
    constructor(method: METHODS, path: PathDefinition);
    /**
     * Return the route definition, helpful to find why the route didn't match the request
     *
     * @returns {RouteDefinition}
     */
    getDefinition(): {
        method: METHODS;
        path: PathDefinition;
        headers: HeaderDefinitions;
        query: HeaderDefinitions;
        body: RequestDefinition;
    };
    /**
     * @return {METHODS} Route method
     */
    getMethod(): METHODS;
    /**
     * @return {string}
     */
    getPath(): PathDefinition;
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
    setHeaders(headers: HeaderDefinitions): this;
    /**
     * @return {HeadersDefinition} Route headers definition
     */
    getHeaders(): HeaderDefinitions;
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
     * @param {RequestDefinition} definition Header definition
     * @returns {this}
     */
    setHeader(header: string, definition: RequestDefinition): this;
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
    setQueryParameters(query: QueryDefinitions): this;
    /**
     * @return {QueryDefinitions} Query parameters definitions
     */
    getQueryParameters(): HeaderDefinitions;
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
     * @param {RequestDefinition} definition Query parameter definition
     * @returns {this}
     */
    setQueryParameter(queryParameter: string, definition: RequestDefinition): this;
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
    setBody(body: RequestBodyDefinition): this;
    /**
     * @return {BodyDefinition} Request body definition
     */
    getBody(): RequestDefinition;
    /**
     * Set the response status code
     * @param {Number} statusCode HTTP status code
     * @returns {this}
     */
    setResponseStatusCode(statusCode: number): this;
    getResponseStatusCode(): number;
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
    setResponseBody(body: JsonValue): this;
    getResponseBody(): string | number | boolean | object | import("./@types").TemplateFunction | import("./@types").TemplateObject | null;
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
    setResponseHeaders(headers: Record<string, string>): this;
    getResponseHeaders(): Record<string, string | import("./@types").TemplateFunction>;
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
    setResponseHeader(header: string, value: string): this;
    /**
     * Return the number of times the route has been called
     *
     * ```js
     * const route = ws.get('/resource');
     * expect(route.countCalls()).toBe(0);
     * await got(`${ws.getOrigin()}/resource`);
     * expect(route.countCalls()).toBe(1);
     * ```
     *
     * @returns {number}
     */
    countCalls(): number;
    /**
     * Return the number of times the route has been called
     *
     * ```js
     * const route = ws.get('/resource');
     * expect(route.countCalls()).toBe(0);
     * await got(`${ws.getOrigin()}/resource`);
     * expect(route.getCall(0)).toBe(1);
     * ```
     *
     * @param {number} index
     * @returns {number}
     */
    getCall(index: number): RequestInfo;
    addCall(req: RequestInfo): void;
}
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
 * @typedef {Object.<string, RequestDefinition>} QueryParametersDefinition
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
 * @typedef {string|Array|Object.<string, RequestDefinition|Body>} BodyDefinition
 */
