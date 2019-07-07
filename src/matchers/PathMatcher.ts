import { Request } from '../@types';
import { Route } from '../Route';

import { match } from './utils';
/**
 * @internal
 */
export function pathMatcher(route: Route) {
  return (req: Request) => {
    const { path } = req;
    return match(route.getPath(), path);
  };
}
