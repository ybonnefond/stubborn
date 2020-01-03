export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum STATUS_CODES {
  // 2xx Success
  SUCCESS = 200,

  // 5xx Server Errors
  NOT_IMPLEMENTED = 501,
}

export const EVENTS = {
  NOT_IMPLEMENTED: Symbol.for('NOT_IMPLEMENTED'),
  CLEARED: Symbol.for('CLEARED'),
};

export const WILDCARD = Symbol.for('WILDCARD');

export enum DIFF_TYPES {
  FAIL_EQUALITY = 'FAIL_EQUALITY',
  FAIL_MATCHING = 'FAIL_MATCHING',
  FAIL_FUNCTION = 'FAIL_FUNCTION',
  MISSING = 'MISSING',
  EXTRA = 'EXTRA',
  INVALID_VALUE_TYPE = 'INVALID_VALUE_TYPE',
}
