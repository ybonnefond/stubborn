import { IncomingMessage, ServerResponse } from 'http';
import { DIFF_TYPES } from '../constants';

export type MatchFunction = (value: JsonValue) => boolean;

export type JsonValue = null | string | number | boolean | object;
export type DefinitionValue =
  | null
  | RegExp
  | MatchFunction
  | JsonValue
  | undefined;

export type MethodDefinition = string;
export type PathDefinition = null | string | RegExp | MatchFunction;
export type RequestBodyDefinition = DefinitionValue;
export type HeaderDefinitions = Record<string, DefinitionValue> | null;
export type QueryDefinitions = Record<string, DefinitionValue> | null;

export type TemplateFunction = (request: Request, scope: any) => JsonValue;

export type TemplateObject = {
  [key: string]: JsonValue | TemplateFunction | TemplateObject;
};

export type TemplateArray = {
  [index: number]: JsonValue | TemplateFunction | TemplateObject;
};

export type Template =
  | JsonValue
  | TemplateFunction
  | TemplateObject
  | TemplateArray;

export type ResponseBodyDefinition =
  | JsonValue
  | TemplateFunction
  | TemplateObject;

export type ResponseDefinition = {
  statusCode: number;
  headers: Record<string, string | TemplateFunction>;
  body: ResponseBodyDefinition;
};

export type RequestInfo = {
  headers: Record<string, string>;
  body: JsonValue | undefined;
  path: string;
  query: Record<string, string | string[]>;
  hash: string;
  method: string;
};

export type Request = IncomingMessage &
  RequestInfo & {
    searchParams?: URLSearchParams;
  };

export type Response = ServerResponse;
export type NextFunction = (err?: any) => void;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => any;

export type RequestMatcher = (req: Request) => boolean;

export type ResponseHeaders = {
  [key: string]: string;
};

export type ResponseBody = JsonValue;
