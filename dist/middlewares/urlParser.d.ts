/// <reference types="node" />
import { Request, NextFunction } from '../@types';
export declare type UrlParserMiddlewareOptions = {
    host?: string;
    port: number | null;
};
export declare function urlParser(options: UrlParserMiddlewareOptions): (req: Request, _: import("http").ServerResponse, next: NextFunction) => void;
