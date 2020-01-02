import {
  BodyDefinition,
  HeaderDefinition,
  HeadersDefinition,
  PathDefinition,
  QueryDefinition,
  QueryParameterDefinition,
  RequestInfo,
  ResponseDefinition,
  ResponseHeaders,
  Template,
} from './@types';

import { METHODS, STATUS_CODES, WILDCARD } from './constants';

/**
 * Object holding the route definitions, requests matchers and response templates
 */
export class Route {
  private body: BodyDefinition = undefined;
  private headers: HeadersDefinition = {};
  private query: QueryDefinition = {};

  private response: ResponseDefinition;

  private calls: RequestInfo[] = [];

  constructor(private method: METHODS, private path: PathDefinition) {
    this.setHeaders({
      'user-agent': WILDCARD,
      'accept-encoding': WILDCARD,
      accept: WILDCARD,
      'content-length': WILDCARD,
      host: WILDCARD,
      connection: WILDCARD,
    });

    this.setQueryParameters({});

    this.response = {
      statusCode: STATUS_CODES.SUCCESS,
      headers: {},
      body: null,
    };
  }

  /**
   * Return the route definition, helpful to find why the route didn't match the request
   */
  public getDefinition() {
    return {
      method: this.method,
      path: this.path,
      headers: this.headers,
      query: this.query,
      body: this.body,
    };
  }

  /**
   * @return Route method
   */
  public getMethod() {
    return this.method;
  }

  /**
   * @return The route path definition
   */
  public getPath() {
    return this.path;
  }

  /**
   * Set the headers definition.
   *
   * @example
   * ```typescript
   * // Bypass all headers
   * stubborn
   *   .get('/bypass')
   *   .setHeaders(WILDCARD);
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
   * @param headers Headers definition
   */
  public setHeaders(headers: HeadersDefinition) {
    this.headers =
      WILDCARD === headers ? headers : Object.assign({}, this.headers, headers);

    return this;
  }

  /**
   * @return Route headers definition
   */
  public getHeaders() {
    return this.headers;
  }

  /**
   * Set a specific header definition.
   *
   * @example
   * ```typescript
   * stubborn
   *   .get('/match')
   *   .setHeader('Authorization', 'BEARER');
   * ```
   * @param header Header name
   * @param definition Header definition
   */
  public setHeader(header: string, definition: HeaderDefinition) {
    if (WILDCARD === this.headers) {
      this.headers = {};
    }

    this.headers[header] = definition;

    return this;
  }

  /**
   * Set the query parameters definition.
   *
   * @example
   * ```typescript
   * // Bypass all query parameters
   * stubborn
   *   .get('/bypass')
   *   .setQueryParameters(WILDCARD);
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
   * @param query Query parameters definition
   */
  public setQueryParameters(query: QueryDefinition) {
    this.query =
      WILDCARD === query ? query : Object.assign({}, this.query, query);

    return this;
  }

  /**
   * @return Query parameters definitions
   */
  public getQueryParameters() {
    return this.query;
  }

  /**
   * Set a specific query parameter
   *
   * @example
   * ```typescript
   * stubborn
   *   .get('/match')
   *   .setQueryParameter('page', '100');
   * ```
   * @param queryParameter Query parameters name
   * @param definition Query parameter definition
   */
  public setQueryParameter(
    queryParameter: string,
    definition: QueryParameterDefinition,
  ) {
    if (WILDCARD === this.query) {
      this.query = {};
    }

    this.query[queryParameter] = definition;

    return this;
  }

  /**
   * Set the body definition. Body can be a string or a complex object mixing
   *
   * @example
   * ```typescript
   * // Bypass all query parameters
   * stubborn
   *   .get('/bypass')
   *   .setBody(WILDCARD);
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
   *     object: { reg: /\d+/, bypass: WILDCARD },
   *     arr: [{ item: '1' }, { item: /2/ }]
   *   });
   * ```
   * @param body Body definition
   */
  public setBody(body: BodyDefinition) {
    this.body = body;

    return this;
  }

  /**
   * @return Request body definition
   */
  public getBody() {
    return this.body;
  }

  /**
   * Set the response status code
   * @param statusCode HTTP status code
   */
  public setResponseStatusCode(statusCode: number) {
    this.response.statusCode = statusCode;

    return this;
  }
  /**
   * Get the response status code
   * @return HTTP status code
   */
  public getResponseStatusCode() {
    return this.response.statusCode;
  }

  /**
   * Set the response body
   *
   * If response is an Object, values can be a function which will receive the request as parameter
   *
   * @example
   * ```typescript
   * // String body
   * stubborn.get('/resource')
   *   .setResponseBody('Hello world');
   *
   * // Objects as JSON body
   * stubborn.get('/resource')
   *   .setResponseBody({ key: 'value' });
   *
   * // Template function
   * stubborn.get('/resource')
   *   .setResponseBody((request) => ({
   *     page: req.param.page
   *   }));
   *
   * // Template in sub keys
   * stubborn.get('/resource')
   *   .setResponseBody({
   *     key: {
   *       sub1: 'val1',
   *       sub2: (req: Request, scope: any) => `sub1=${scope.sub1}`
   *     }
   *   });
   * ```
   * @param body Body replied if route is matched
   */
  public setResponseBody(body: Template) {
    this.response.body = body;

    return this;
  }

  /**
   * @return Response body template
   */
  public getResponseBody() {
    return this.response.body;
  }

  /**
   * Set the response headers
   * key/value object. If value is a function it will receive the request as parameter
   *
   * @example
   * ```typescript
   * stubborn.get('/resource')
   *   .setResponseHeaders({
   *     'Content-type': 'application/json',
   *     'Custom-Header': (req) => `${req.header.custom}-response`
   *   });
   * ```
   * @param headers Response header template
   */
  public setResponseHeaders(headers: ResponseHeaders) {
    this.response.headers = headers;

    return this;
  }

  /**
   * @return The response headers template
   */
  public getResponseHeaders() {
    return this.response.headers;
  }

  /**
   * Set a response header
   *
   * @example
   * ```typescript
   * stubborn.get('/resource')
   *   .setResponseHeader('Content-type', 'application/json');
   * ```
   * @param header Header name
   * @param value Header template
   */
  public setResponseHeader(header: string, value: string) {
    this.response.headers[header] = value;

    return this;
  }

  /**
   * @example
   * ```typescript
   * const route = stubborn.get('/resource');
   * expect(route.countCalls()).toBe(0);
   *
   * await got(`${stubborn.getOrigin()}/resource`);
   * expect(route.countCalls()).toBe(1);
   * ```
   *
   * @returns The number of times the route has been called
   */
  public countCalls() {
    return this.calls.length;
  }

  /**
   * Get information of a specific request call
   * @example
   * ```typescript
   * const route = stubborn.get('/resource');
   * expect(route.countCalls()).toBe(0);
   * await got(`${stubborn.getOrigin()}/resource`);
   * expect(route.getCall(0)).toBe(1);
   * ```
   *
   * @param index Index of the call
   * @returns The request received
   */
  public getCall(index: number) {
    return this.calls[index];
  }

  /**
   * Add a request to the call stack
   *
   * This method is used internaly by the router every time the route is matched by the incomming request
   * @param req
   */
  public addCall(req: RequestInfo) {
    this.calls.push(req);
  }
}
