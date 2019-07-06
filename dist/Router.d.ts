/// <reference types="node" />
import { Server } from 'http';
import { PathDefinition } from './@types';
import { METHODS } from './constants';
import { Route } from './Route';
import { RouteMatcher } from './RouteMatcher';
export declare type RouterOptions = {
    host?: string;
};
declare type MatchableRoute = {
    route: Route;
    matcher: RouteMatcher;
};
export declare class Router {
    private options;
    private port;
    private routes;
    constructor(options: RouterOptions);
    createRoute(method: METHODS, path: PathDefinition): Route;
    clear(): void;
    handle(server: Server): void;
    getRoutes(): Set<MatchableRoute>;
    getHost(): string | undefined;
    getPort(): number | null;
}
export {};
