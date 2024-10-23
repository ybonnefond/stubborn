import { DiffError, RequestInfo } from '../@types';
import { DIFF_SUBJECTS, WILDCARD } from '../constants';
import { checkValue, findErrors } from './utils';
import { Route } from '../Route';

export function headersDiff(route: Route, request: RequestInfo): DiffError[] {
  const headersDefinitions = route.getHeaders();
  const headersValues = request.headers;

  const definition =
    WILDCARD === headersDefinitions
      ? WILDCARD
      : keysToLowerCase(headersDefinitions);
  const value = keysToLowerCase(headersValues);

  return findErrors({
    subject: DIFF_SUBJECTS.HEADERS,
    definition,
    value,
    validate: checkValue,
    prefix: '',
  });
}

function keysToLowerCase(o: Record<string, any>): Record<string, any> {
  const props = Object.keys(Object(o));
  let n = props.length;
  const copy: Record<string, any> = {};

  while (n--) {
    const key = props[n];
    const lKey = key.toLowerCase();
    copy[lKey] = o[key];
  }

  return copy;
}
