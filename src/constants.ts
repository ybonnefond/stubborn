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
};

export const WILDCARD = Symbol.for('WILDCARD');
