import { Request, RequestMatcher } from './@types';
import { matchers } from './matchers';
import { Route } from './Route';

/**
 * @internal
 * Class responsible to check if a route matches the incomming request
 * based on route definitions
 */
export class RouteMatcher {
  private matchers: RequestMatcher[] = [];

  constructor(route: Route) {
    this.matchers = Object.values(matchers).map(matcher => {
      return matcher(route);
    });
  }

  /**
   *
   * @param req Incomming Request
   */
  public match(req: Request) {
    return this.matchers.every(matcher => {
      return matcher(req);
    });
  }
}
