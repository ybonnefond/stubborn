import { Request } from '../@types';
import { Route } from '../Route';

import { match } from './utils';

export function methodMatcher(route: Route) {
  return (req: Request) => {
    const { method } = req;
    return match(route.getMethod(), method);
  };
}
