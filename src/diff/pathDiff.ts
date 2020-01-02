import { DiffError, PathDefinition } from '../@types';
import { checkValue } from './utils';

export function pathDiff(def: PathDefinition, value: string): DiffError[] {
  return checkValue(def, value, '');
}
