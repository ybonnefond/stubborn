import { Request } from '../@types';
import { Route } from '../Route';

import { match } from './utils';
/**
 * @internal
 */
export function bodyMatcher(route: Route) {
  return (req: Request) => {
    const definition = route.getBody();

    if (hasBody(req) === false) {
      return definition === undefined;
    }

    const body = extract(req);

    // Bypass body matching
    if (null === definition) {
      return true;
    }

    return match(definition, body);
  };
}

function extract(req:Request) {
  const { body: rawBody } = req;
  return rawBody instanceof Buffer ? String(rawBody) : rawBody;
}

function hasBody(req: Request) {
  if (req.headers['transfer-encoding'] !== undefined) {
    return true;
  }

  const length = req.headers['content-length'];

  if (length !== undefined && !isNaN(parseInt(length, 10))) {
    return true;
  }

  return false;
}
