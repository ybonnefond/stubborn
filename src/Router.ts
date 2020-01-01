import EventEmitter from 'events';
import { OutgoingHttpHeaders, Server } from 'http';

import accept from '@hapi/accept';
import contentType from 'content-type';

import {
  JsonValue,
  Middleware,
  NextFunction,
  PathDefinition,
  Request,
  DefinitionValue,
  RequestInfo,
  Response,
  ResponseBody,
  ResponseHeaders,
  Template,
  TemplateFunction,
  TemplateObject,
} from './@types';

import { EVENTS, METHODS, STATUS_CODES } from './constants';
import { middlewares } from './middlewares';
import { Route } from './Route';
import { RouteMatcher } from './RouteMatcher';
import { getServerPort } from './utils';
/**
 * @internal
 */
export type RouterOptions = {
  host?: string;
};
/**
 * @internal
 */
type MatchableRoute = {
  route: Route;
  matcher: RouteMatcher;
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

  private routes: Set<MatchableRoute> = new Set();

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
    const matcher = new RouteMatcher(route);
    this.routes.add({ route, matcher });

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

        return resolve();
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
    const route = findRoute(router.getRoutes(), req);

    if (null === route) {
      replyNotImplemented(res, req, emitter);
    } else {
      reply(route, res, req);
    }

    next();
  };
}

/**
 * @internal
 */
function extractRequestInfo(req: Request): RequestInfo {
  return {
    method: req.method,
    path: req.path,
    headers: req.headers,
    query: req.query,
    body: req.body,
    hash: req.hash,
  };
}

/**
 * @internal
 */
function buildMiddlewares(router: Router) {
  return [
    middlewares.urlParser({ host: router.getHost(), port: router.getPort() }),
    middlewares.bodyJson(),
    middlewares.bodyUrlEncoded(),
    middlewares.bodyRaw(),
    middlewares.bodyEmpty(),
  ];
}
/**
 * @internal
 */
function findRoute(routes: Set<MatchableRoute>, req: Request) {
  for (const [{ route, matcher }] of routes.entries()) {
    if (matcher.match(req)) {
      return route;
    }
  }

  return null;
}
/**
 * @internal
 */
function reply(route: Route, res: Response, req: Request) {
  const stripedReq = stripReq(req);
  route.addCall(stripedReq);

  const headers = applyTemplate(
    route.getResponseHeaders(),
    req,
  ) as OutgoingHttpHeaders;
  const body = applyTemplate(route.getResponseBody(), req);

  res.writeHead(route.getResponseStatusCode(), headers);

  res.write(encodeBody(req, headers, body));
  res.end();
}
/**
 * @internal
 */
function replyNotImplemented(
  res: Response,
  req: Request,
  emitter: EventEmitter,
) {
  res.writeHead(STATUS_CODES.NOT_IMPLEMENTED, {
    'Content-Type': 'application/json',
  });
  res.write(
    JSON.stringify(
      {
        message: 'No route matched',
        request: extractRequestInfo(req),
      },
      null,
      2,
    ),
  );

  res.end();

  setImmediate(() => emitter.emit(EVENTS.NOT_IMPLEMENTED, req));
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
  scope?: DefinitionValue,
): JsonValue {
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
      return (template as TemplateFunction)(req, scope);
    case 'object':
      return Object.keys(template).reduce((obj, key) => {
        obj[key] = applyTemplate(
          (template as TemplateObject)[key],
          req,
          template,
        );
        return obj;
      }, {} as Record<string | number, JsonValue>);
    case 'symbol':
      return String(template).replace(/^Symbol\((.*)\)$/, '$1');

    default:
      return template;
  }
}
