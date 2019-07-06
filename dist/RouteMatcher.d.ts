import { Request } from './@types';
import { Route } from './Route';
export declare class RouteMatcher {
    private matchers;
    constructor(route: Route);
    match(req: Request): boolean;
}
