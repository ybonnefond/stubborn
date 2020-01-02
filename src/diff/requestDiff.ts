import { Request } from '../@types';
import { Route } from '../Route';
import { bodyDiff } from './bodyDiff';
import { headersDiff } from './headersDiff';
import { methodDiff } from './methodDiff';
import { pathDiff } from './pathDiff';
import { queryDiff } from './queryDiff';

export function requestDiff(route: Route, request: Request) {
  const body =
    request.body instanceof Buffer ? String(request.body) : request.body;
  return [
    ...methodDiff(route.getMethod(), request.method),
    ...pathDiff(route.getPath(), request.path),
    ...headersDiff(route.getHeaders(), request.headers),
    ...queryDiff(route.getQueryParameters(), request.query),
    ...bodyDiff(route.getBody(), body),
  ];
}
