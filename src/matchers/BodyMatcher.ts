import { Request } from '../@types';
import { Route } from '../Route';

import { match } from './utils';

export function bodyMatcher(route: Route) {
  return (req: Request) => {
    const { body: rawBody } = req;
    const body = rawBody instanceof Buffer ? String(rawBody) : rawBody;
    const bodyDefinition = route.getBody();

    // Bypass body matching
    if (null === bodyDefinition) {
      return true;
    }

    return match(bodyDefinition, body);
  };
}
