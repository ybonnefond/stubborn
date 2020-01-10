import { NextFunction, Request, Response } from '../@types';

/**
 * @internal
 */
export function bodyEmpty() {
  return function bodyEmptyMiddleware(
    req: Request,
    _: Response,
    next: NextFunction,
  ) {
    if (!hasBody(req)) {
      req.body = undefined;
    }

    next();
  };
}

/**
 * @internal
 */
function hasBody(req: Request) {
  if (req.headers['transfer-encoding'] !== undefined) {
    return true;
  }

  const length = req.headers['content-length'];

  if (
    length !== undefined &&
    !isNaN(parseInt(length, 10)) &&
    parseInt(length, 10) > 0
  ) {
    return true;
  }

  return false;
}
