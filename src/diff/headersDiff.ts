import { DiffError, HeadersDefinition, RequestHeaders } from '../@types';
import { WILDCARD } from '../constants';
import { checkValue, findErrors } from './utils';

export function headersDiff(
  _definitions: HeadersDefinition,
  _values: RequestHeaders,
): DiffError[] {
  const definitions =
    WILDCARD === _definitions ? WILDCARD : keysToLowerCase(_definitions);
  const values = keysToLowerCase(_values);

  return findErrors(definitions, values, checkValue);
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
