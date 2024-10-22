import { DiffError } from '../@types';
import { checkValue } from './utils';

export function methodDiff(definition: string, value: string): DiffError[] {
  return checkValue({
    definition: definition.toLowerCase(),
    value: value.toLowerCase(),
    path: '',
  });
}
