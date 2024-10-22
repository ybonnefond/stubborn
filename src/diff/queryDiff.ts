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
  const validate: ValidateFn = (params: {
    definition: any;
    value: any;
    path: string;
  }) => {
    if (!Array.isArray(params.definition)) {
      return checkParameters(params);
    }

    // Definition is an array, but value is not
    if (!Array.isArray(params.value)) {
      return [
        formatDiffError({
          ...params,
          type: DIFF_TYPES.INVALID_VALUE_TYPE,
        }),
      ];
    }

    return findErrors({
      definition: params.definition,
      value: params.value,
      prefix: params.path,
      validate: checkParameters,
    });
  };

  return findErrors({ definition, value, validate, prefix: '' });
}

function checkParameters({
  definition,
  value,
  path,
}: {
  definition: QueryParameterDefinition;
  value: string | string[];
  path: string;
}) {
  if (Array.isArray(value)) {
    return value.reduce((acc: DiffError[], val, i) => {
      checkValue({ definition, value: val, path: `${path}.${i}` }).forEach(
        error => acc.push(error),
      );

      return acc;
    }, []);
  }

  return checkValue({ definition, value, path });
}
