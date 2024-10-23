import { BodyDefinition, DiffError, RequestInfo, RequestBody } from '../@types';
import { checkValue, findErrors } from './utils';
import { DIFF_SUBJECTS } from '../constants';
import { Route } from '../Route';

const subject = DIFF_SUBJECTS.BODY;

export function bodyDiff(route: Route, request: RequestInfo): DiffError[] {
  const value =
    request.body instanceof Buffer ? String(request.body) : request.body;
  return rec({ definition: route.getBody(), value, path: '' });
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
    return findErrors({
      subject,
      definition,
      value,
      validate: rec,
      prefix: path,
    });
  }

  return checkValue({ subject, definition, value, path });
}
