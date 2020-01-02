import { DiffError } from '../@types';
import { checkValue } from './utils';

export function methodDiff(def: string, value: string): DiffError[] {
  return checkValue(def.toLowerCase(), value.toLowerCase(), '');
}
