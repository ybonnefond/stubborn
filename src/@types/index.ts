import { IncomingMessage, ServerResponse } from 'http';
import { DIFF_SUBJECTS, DIFF_TYPES, METHODS, WILDCARD } from '../constants';

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [member: string]: JsonValue };
export interface JsonArray extends Array<JsonValue> {}
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// TODO use generic type in match function so each element (header, body, query, etc...) can specify the type of the value
export type MatchFunction = (value: JsonValue) => boolean;
export type DefinitionMatcher = RegExp | MatchFunction | typeof WILDCARD;
export type DefinitionValue =
  | DefinitionMatcher
  | JsonValue
  | undefined
  | METHODS; // Any possible values for definition

// Request part definitions types
export type MethodDefinition = METHODS;
export type PathDefinition = DefinitionMatcher | string;
export type HeaderDefinition = DefinitionMatcher | string | number;
export type HeadersDefinition =
  | Record<string, HeaderDefinition>
  | typeof WILDCARD;

export type BodyDefinitionPrimitive = DefinitionMatcher | JsonValue;
export type BodyDefinitionObject = {
  [member: string]: BodyDefinitionValue;
};
export interface BodyDefinitionArray extends Array<BodyDefinitionValue> {}
export type BodyDefinitionValue =
  | BodyDefinitionPrimitive
  | BodyDefinitionObject
  | BodyDefinitionArray;
export type BodyDefinition = undefined | BodyDefinitionValue;

export type QueryParameterDefinitionPrimitives =
  | DefinitionMatcher
  | string
  | number;
export type QueryParameterDefinition =
  | QueryParameterDefinitionPrimitives
  | QueryParameterDefinitionPrimitives[];
export type QueryDefinition =
  | Record<string, QueryParameterDefinition>
  | typeof WILDCARD;

export type TemplateFunction = (request: Request, scope: any) => JsonValue;
export type TemplateObject = { [key: string]: Template };
export type TemplateArray = { [index: number]: Template };

export type Template =
  | JsonValue
  | TemplateFunction
  | TemplateObject
  | TemplateArray;

export type ResponseDefinition = {
  statusCode: number;
  headers: Record<string, string | TemplateFunction>;
  body: Template | Buffer;
};

export type RequestHeaders = Record<string, string>;
export type RequestQuery = Record<string, string | string[]>;
export type RequestBody = JsonValue | undefined;
export type RequestPath = string;
export type RequestHash = string;
export type RequestMethod = string;

export type RequestInfo = {
  headers: RequestHeaders;
  body: RequestBody;
  path: RequestPath;
  query: RequestQuery;
  hash: RequestHash;
  method: RequestMethod;
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

export type ResponseBody = JsonValue | Buffer;

export interface DiffError {
  subject: DIFF_SUBJECTS;
  type: DIFF_TYPES;
  definition: string | null;
  value: JsonValue;
  path: string;
}
export { LineInfo } from './LineInfo';
