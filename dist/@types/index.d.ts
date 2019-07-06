/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
export interface MatchFunction {
    (value: JsonValue): boolean;
}
export declare type JsonValue = null | string | number | boolean | object;
export declare type RequestDefinition = null | RegExp | MatchFunction | JsonValue;
export declare type PathDefinition = null | string | RegExp | MatchFunction;
export declare type RequestBodyDefinition = RequestDefinition;
export declare type HeaderDefinitions = Record<string, RequestDefinition> | null;
export declare type QueryDefinitions = Record<string, RequestDefinition> | null;
export interface TemplateFunction {
    (request: Request, scope: any): JsonValue;
}
export interface TemplateObject {
    [key: string]: JsonValue | TemplateFunction | TemplateObject;
}
export interface TemplateArray {
    [index: number]: JsonValue | TemplateFunction | TemplateObject;
}
export declare type Template = JsonValue | TemplateFunction | TemplateObject | TemplateArray;
export declare type ResponseBodyDefinition = JsonValue | TemplateFunction | TemplateObject;
export declare type ResponseDefinition = {
    statusCode: number;
    headers: Record<string, string | TemplateFunction>;
    body: ResponseBodyDefinition;
};
export declare type RequestInfo = {
    headers: Record<string, string>;
    body: JsonValue;
    path: string;
    query: Record<string, string | string[]>;
    hash: string;
    method: string;
};
export declare type Request = IncomingMessage & RequestInfo & {
    searchParams?: URLSearchParams;
};
export declare type Response = ServerResponse;
export interface NextFunction {
    (err?: any): void;
}
export declare type Middleware = {
    (req: Request, res: Response, next: NextFunction): any;
};
export interface RequestMatcher {
    (req: Request): boolean;
}
export interface ResponseHeaders {
    [key: string]: string;
}
export declare type ResponseBody = JsonValue;
