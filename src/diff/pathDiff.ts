import { DiffError, PathDefinition } from '../@types';
import { checkValue } from './utils';

export function pathDiff(
  definition: PathDefinition,
  value: string,
): DiffError[] {
  return checkValue({ definition, value, path: '' });
}
