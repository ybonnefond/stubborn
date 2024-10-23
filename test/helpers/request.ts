import { RequestInfo } from '../../src';

export function makeRequestInfo(
  overrides: Partial<RequestInfo> = {},
): RequestInfo {
  return {
    method: 'GET',
    path: '/',
    headers: {},
    query: {},
    body: null,
    hash: '',
    ...overrides,
  };
}
