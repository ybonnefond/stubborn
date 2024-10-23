import { DiffError, RequestInfo } from '../@types';
import { checkValue } from './utils';
import { DIFF_SUBJECTS } from '../constants';
import { Route } from '../Route';

export function pathDiff(route: Route, request: RequestInfo): DiffError[] {
  return checkValue({
    subject: DIFF_SUBJECTS.PATH,
    definition: route.getPath(),
    value: request.path,
    path: '',
  });
}
