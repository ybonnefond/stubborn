import { DiffError, HeadersDefinition, RequestHeaders } from '../@types';
import { DIFF_SUBJECTS, WILDCARD } from '../constants';
import { checkValue, findErrors } from './utils';

export function headersDiff(
  _definitions: HeadersDefinition,
  _values: RequestHeaders,
): DiffError[] {
  const definition =
    WILDCARD === _definitions ? WILDCARD : keysToLowerCase(_definitions);
  const value = keysToLowerCase(_values);

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
