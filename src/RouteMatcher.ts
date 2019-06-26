import { Request, RequestMatcher } from './@types';
import { matchers } from './matchers';
import { Route } from './Route';

export class RouteMatcher {
  private matchers: RequestMatcher[] = [];

  constructor(route: Route) {
    this.matchers = Object.values(matchers).map(matcher => {
      return matcher(route);
    });
  }

  public match(req: Request) {
    return this.matchers.every(matcher => {
      return matcher(req);
    });
  }
}
