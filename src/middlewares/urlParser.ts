import { URL } from 'url';

import { NextFunction, Request, Response } from '../@types';
/**
 * @internal
 */
export type UrlParserMiddlewareOptions = {
  host?: string;
  port: number | null;
};
/**
 * @internal
 */
export function urlParser(options: UrlParserMiddlewareOptions) {
  return function urlParserMiddleware(
    req: Request,
    _: Response,
    next: NextFunction,
  ) {
    const parsedUrl = new URL(
      req.url as string,
      `http://${options.host}:${options.port}/`,
    );
    req.path = parsedUrl.pathname;
    req.searchParams = parsedUrl.searchParams;
    req.query = convertSearchParamsToQuery(parsedUrl.searchParams.entries());
    req.hash = parsedUrl.hash;

    next();
  };
}
/**
 * @internal
 */
function convertSearchParamsToQuery(
  searchParams: IterableIterator<[string, string]>,
) {
  const query: Record<string, string | string[]> = {};

  for (const [key, value] of searchParams) {
    if (key in query) {
      // Convert to array if there are multiple value for the query parameter
      if (!Array.isArray(query[key])) {
        query[key] = [query[key] as string];
      }
      (query[key] as string[]).push(value);
    }

    query[key] = value;
  }

  return query;
}
