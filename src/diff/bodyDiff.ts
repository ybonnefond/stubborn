import { BodyDefinition, DiffError, RequestBody } from '../@types';
import { checkValue, findErrors } from './utils';

export function bodyDiff(
  definition: BodyDefinition,
  value: RequestBody,
): DiffError[] {
  return rec({ definition, value, path: '' });
}

function rec({
  definition,
  value,
  path,
}: {
  definition: BodyDefinition;
  value: RequestBody;
  path: string;
}) {
  if (
    typeof definition === 'object' &&
    definition !== null &&
    !(definition instanceof RegExp)
  ) {
    return findErrors({ definition, value, validate: rec, prefix: path });
  }

  return checkValue({ definition, value, path });
}
