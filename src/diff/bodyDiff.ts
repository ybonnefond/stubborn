import { BodyDefinition, DiffError, RequestBody } from '../@types';
import { checkValue, findErrors } from './utils';

export function bodyDiff(
  definitions: BodyDefinition,
  values: RequestBody,
): DiffError[] {
  return rec(definitions, values);
}

function rec(definitions: BodyDefinition, values: RequestBody, path = '') {
  if (
    typeof definitions === 'object' &&
    definitions !== null &&
    !(definitions instanceof RegExp)
  ) {
    return findErrors(definitions, values, rec, path);
  }

  return checkValue(definitions, values, path);
}
