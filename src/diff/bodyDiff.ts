import { BodyDefinition, DiffError, RequestBody } from '../@types';
import { checkValue, findErrors } from './utils';

export function bodyDiff(
  definitions: BodyDefinition,
  values: RequestBody,
): DiffError[] {
  return rec(definitions, values);
}

function rec(definition: BodyDefinition, value: RequestBody, path = '') {
  if (
    typeof definition === 'object' &&
    definition !== null &&
    !(definition instanceof RegExp)
  ) {
    return findErrors({ definition, value, validate: rec, prefix: path });
  }

  return checkValue(definition, value, path);
}
