import { RequestInfo } from '../@types';
import { Route } from '../Route';
import { bodyDiff } from './bodyDiff';
import { headersDiff } from './headersDiff';
import { methodDiff } from './methodDiff';
import { pathDiff } from './pathDiff';
import { queryDiff } from './queryDiff';

export function requestDiff(route: Route, request: RequestInfo) {
  return [
    ...methodDiff(route, request),
    ...pathDiff(route, request),
    ...headersDiff(route, request),
    ...queryDiff(route, request),
    ...bodyDiff(route, request),
  ];
}
