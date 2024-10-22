import { DiffError, PathDefinition } from '../@types';
import { checkValue } from './utils';
import { DIFF_SUBJECTS } from '../constants';

export function pathDiff(
  definition: PathDefinition,
  value: string,
): DiffError[] {
  return checkValue({
    subject: DIFF_SUBJECTS.PATH,
    definition,
    value,
    path: '',
  });
}
