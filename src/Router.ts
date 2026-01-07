import { EventEmitter } from 'events';
import { OutgoingHttpHeaders, Server } from 'http';

import accept from '@hapi/accept';
import contentType from 'content-type';

import {
  JsonValue,
  Middleware,
  NextFunction,
  PathDefinition,
  Request,
  RequestInfo,
  Response,
  ResponseBody,
  ResponseHeaders,
  Template,
  TemplateFunction,
  TemplateObject,
} from './@types';

import { EVENTS, METHODS, STATUS_CODES } from './constants';
import { Debugger } from './debug/Debugger';
import { requestDiff } from './diff/requestDiff';
import { middlewares } from './middlewares';
import { Route } from './Route';
import { findCaller, getServerPort, logDiffOn501 } from './utils';
import { methodDiff } from './diff/methodDiff';
import { pathDiff } from './diff/pathDiff';
/**
 * @internal
 */
export type RouterOptions = {
  host?: string;
};

/**
 * @internal
 * Internal Router
 *
 * Class in charge of receiving request, find the route definition and return the response
 *
 * @todo Refactoring
 */
export class Router {
  private options: RouterOptions;
  private port: number | null = null;
  private emitter: EventEmitter;

  private routes: Set<Route> = new Set();

  constructor(options: RouterOptions, emitter: EventEmitter) {
    this.emitter = emitter;
    this.options = Object.assign(
      {
        host: '',
      },
      options,
    );
  }

  public addRoute(route: Route) {
    route.setInitializerPath(findCaller());
    this.routes.add(route);

    return route;
  }

  public removeRoute(route: Route) {
    this.routes.delete(route);

    return route;
  }

  public createRoute(method: METHODS, path: PathDefinition) {
    return this.addRoute(new Route(method, path));
  }

  public clear() {
    this.routes.clear();
  }

  public handle(server: Server) {
    this.port = getServerPort(server);
    const mws = buildMiddlewares(this);
    mws.push(buildRequestHandler(this, this.emitter));
    server.on('request', (req: Request, res: Response) => {
      return runMiddlewares(mws.slice(0), req, res);
    });
  }

  public getRoutes() {
    return this.routes;
  }

  public getHost() {
    return this.options.host;
  }

  public getPort() {
    return this.port;
  }
}
/**
 * @internal
 */
function runMiddlewares(
  mws: Middleware[],
  req: Request,
  res: Response,
): Promise<void> {
  if (mws.length === 0) {
    return Promise.resolve();
  }

  const mw = mws.shift() as Middleware;

  return runMiddleware(mw, req, res).then(() => runMiddlewares(mws, req, res));
}
/**
 * @internal
 */
function runMiddleware(mw: Middleware, req: Request, res: Response) {
  return new Promise((resolve, reject) => {
    try {
      mw(req, res, (err: Error) => {
        if (err) {
          return reject(err);
        }

        return resolve(null);
      });
    } catch (err) {
      reject(err);
    }
  });
}
/**
 * @internal
 */
function buildRequestHandler(router: Router, emitter: EventEmitter) {
  return (req: Request, res: Response, next: NextFunction) => {
    registerLogDiff(router, emitter);
    const route = findRoute(router.getRoutes(), req);

    if (null === route) {
      replyNotImplemented(router.getRoutes(), res, req, emitter);
    } else {
      reply({ router, route, res, req, emitter });
    }

    next();
  };
}

function reply({
  router,
  route,
  res,
  req,
  emitter,
}: {
  router: Router;
  route: Route;
  res: Response;
  req: Request;
  emitter: EventEmitter;
}) {
  const dbg = new Debugger(req);
  const stripedReq = stripReq(req);
  route.addCall(stripedReq);

  if (route.hasReachMaxCalls()) {
    router.removeRoute(route);
  }

  const headers = applyTemplate(
    route.getResponseHeaders(),
    req,
  ) as OutgoingHttpHeaders;

  const rawBody = route.getResponseBody();
  const body =
    rawBody instanceof Buffer ? rawBody : applyTemplate(rawBody, req);

  if (!res.headersSent) {
    res.writeHead(route.getResponseStatusCode(), headers);
  }

  const data = encodeBody(req, headers, body);

  if (data !== null) {
    res.write(data);
  }

  res.end();

  setImmediate(() => emitter.emit(EVENTS.REPLIED, dbg));
}

function registerLogDiff(router: Router, emitter: EventEmitter) {
  router.getRoutes().forEach(route => {
    if (route.shouldLogDiffOn501()) {
      logDiffOn501(emitter, route);
    }
  });
}

/**
 * @internal
 */
function buildMiddlewares(router: Router) {
  return [
    middlewares.urlParser({ host: router.getHost(), port: router.getPort() }),
    middlewares.bodyJson(),
    middlewares.bodyUrlEncoded(),
    middlewares.bodyMultipartFormData(),
    middlewares.bodyRaw(),
    middlewares.bodyEmpty(),
  ];
}
/**
 * @internal
 */
function findRoute(routes: Set<Route>, req: Request) {
  for (const [route] of routes.entries()) {
    if (requestDiff(route, req).length === 0) {
      return route;
    }
  }

  return null;
}

function findEndpointRouteDiffs(routes: Set<Route>, req: Request) {
  const diffs = [];
  for (const [route] of routes.entries()) {
    const isEndpoint =
      [...methodDiff(route, req), ...pathDiff(route, req)].length === 0;
    if (isEndpoint) {
      diffs.push({
        route: {
          path: route.getInitializerPath(),
        },
        diffs: requestDiff(route, req),
      });
    }
  }

  return diffs;
}

/**
 * @internal
 */
function replyNotImplemented(
  routes: Set<Route>,
  res: Response,
  req: Request,
  emitter: EventEmitter,
) {
  const dbg = new Debugger(req);
  if (!res.headersSent) {
    res.writeHead(STATUS_CODES.NOT_IMPLEMENTED, {
      'Content-Type': 'application/json',
    });
  }

  res.write(
    JSON.stringify(
      {
        message: 'No route matched',
        request: dbg.getInfo(),
        endpointsDiffs: findEndpointRouteDiffs(routes, req),
      },
      null,
      2,
    ),
  );

  res.end();

  setImmediate(() => emitter.emit(EVENTS.NOT_IMPLEMENTED, dbg));
}
/**
 * @internal
 */
function encodeBody(
  req: Request,
  headers: OutgoingHttpHeaders,
  body: ResponseBody,
) {
  let mediaTypes: string[] = [];
  const contentTypeValue = findContentType(headers);

  if (typeof contentTypeValue === 'string') {
    mediaTypes.push(contentTypeValue);
  }

  mediaTypes = [...mediaTypes, ...findAcceptTypes(req.headers)];

  const isJson = mediaTypes.some((type: string) =>
    new RegExp('json', 'gi').test(type),
  );

  if (isJson === true) {
    return JSON.stringify(body, null, 2); // eslint-disable-line no-magic-numbers
  }

  return body;
}
/**
 * @internal
 */
function stripReq(req: Request): RequestInfo {
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
/**
 * @internal
 */
function findAcceptTypes(headers: ResponseHeaders) {
  const headerKey = Object.keys(headers).find(name =>
    new RegExp('^accept$', 'i').test(name),
  );

  return 'undefined' === typeof headerKey
    ? []
    : accept.mediaTypes(headers[headerKey]);
}
/**
 * @internal
 */
function findContentType(headers: OutgoingHttpHeaders) {
  const headerKey = Object.keys(headers).find(name =>
    new RegExp('^content-type$', 'i').test(name),
  );

  if ('undefined' === typeof headerKey) {
    return null;
  }

  const headerValue = headers[headerKey];

  if ('string' !== typeof headerValue) {
    return null;
  }

  try {
    return contentType.parse(headerValue).type;
  } catch (e) {
    return null;
  }
}
/**
 * @internal
 */
function applyTemplate(
  template: Template,
  req: Request,
  parentTemplate?: Template,
): JsonValue {
  if (null === template) {
    return template;
  }

  if (Array.isArray(template)) {
    return template.map(item => {
      return applyTemplate(item, req, parentTemplate);
    });
  }

  switch (typeof template) {
    case 'function':
      return (template as TemplateFunction)(req, parentTemplate);
    case 'object':
      const _template = template as TemplateObject;
      return Object.keys(_template).reduce((obj, key) => {
        // undefined values cannot be set on headers or body
        if ('undefined' !== typeof _template[key]) {
          obj[key] = applyTemplate(_template[key], req, template);
        }
        return obj;
      }, {} as Record<string | number, JsonValue>);
    case 'symbol':
      return String(template).replace(/^Symbol\((.*)\)$/, '$1');
  }

  return template as JsonValue;
}
