import { DiffError } from '../@types';
import { checkValue } from './utils';
import { DIFF_SUBJECTS } from '../constants';
import { RequestInfo } from '../@types';
import { Route } from '../Route';

export function methodDiff(route: Route, request: RequestInfo): DiffError[] {
  return checkValue({
    subject: DIFF_SUBJECTS.METHOD,
    definition: route.getMethod().toLowerCase(),
    value: request.method.toLowerCase(),
    path: '',
  });
}
