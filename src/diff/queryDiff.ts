import {
  DiffError,
  QueryDefinition,
  QueryParameterDefinition,
  RequestQuery,
} from '../@types';
import { DIFF_TYPES } from '../constants';
import { checkValue, findErrors, formatDiffError, ValidateFn } from './utils';

export function queryDiff(
  definition: QueryDefinition,
  value: RequestQuery,
): DiffError[] {
  const validate: ValidateFn = (def: any, val: any, path: string) => {
    if (!Array.isArray(def)) {
      return checkParameters(def, val, path);
    }

    // Definition is an array, but value is not
    if (!Array.isArray(val)) {
      return [
        formatDiffError({
          type: DIFF_TYPES.INVALID_VALUE_TYPE,
          definition: def,
          value: val,
          path,
        }),
      ];
    }

    return findErrors({
      definition: def,
      value: val,
      validate: checkParameters,
      prefix: path,
    });
  };

  return findErrors({ definition, value, validate, prefix: '' });
}

function checkParameters(
  definition: QueryParameterDefinition,
  value: string | string[],
  path: string,
) {
  if (Array.isArray(value)) {
    return value.reduce((acc: DiffError[], val, i) => {
      checkValue(definition, val, `${path}.${i}`).forEach(error =>
        acc.push(error),
      );

      return acc;
    }, []);
  }

  return checkValue(definition, value, path);
}
