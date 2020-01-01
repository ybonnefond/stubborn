import { Request } from '../@types';
import { WILDCARD } from '../constants';
import { Route } from '../Route';

import { match } from './utils';
/**
 * @internal
 */
export function bodyMatcher(route: Route) {
  return (req: Request) => {
    const definition = route.getBody();

    const body = extract(req);

    // Bypass body matching
    if (WILDCARD === definition) {
      return true;
    }

    return match(definition, body);
  };
}

function extract(req: Request) {
  const { body: rawBody } = req;
  return rawBody instanceof Buffer ? String(rawBody) : rawBody;
}
