import { DiffError } from '../@types';
import { checkValue } from './utils';
import { DIFF_SUBJECTS } from '../constants';

export function methodDiff(definition: string, value: string): DiffError[] {
  return checkValue({
    subject: DIFF_SUBJECTS.METHOD,
    definition: definition.toLowerCase(),
    value: value.toLowerCase(),
    path: '',
  });
}
