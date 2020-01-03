import { difference, intersection } from 'lodash';

import { DiffError } from '../@types';
import { DIFF_TYPES, WILDCARD } from '../constants';
import { inspect } from '../inspect';

type ObjectOrArray = Record<string | number, any>;
type ValidateFn = (def: any, value: any, path: string) => DiffError[];

export function findErrors(
  definitions: any,
  values: any,
  validate: ValidateFn,
  prefix: string = '',
): DiffError[] {
  if (definitions === WILDCARD) {
    return [];
  }

  if (typeof definitions === 'object' && definitions !== null) {
    return findErrorsObject(definitions, values, validate, prefix);
  }

  return checkValues(definitions, values, validate, prefix);
}

function findErrorsObject(
  definitions: ObjectOrArray,
  values: any,
  validate: ValidateFn,
  prefix: string = '',
) {
  const isValueObject = typeof values === 'object' && values !== null;
  if (!isValueObject) {
    return [
      formatDiffError({
        type: DIFF_TYPES.INVALID_VALUE_TYPE,
        definition: definitions,
        value: values,
        path: prefix,
      }),
    ];
  }

  return [
    ...checkMissing(definitions, values, prefix),
    ...checkExtra(definitions, values, prefix),
    ...checkValues(definitions, values, validate, prefix),
  ];
}

function checkMissing(
  definitions: ObjectOrArray,
  values: ObjectOrArray,
  prefix: string = '',
) {
  const errors: DiffError[] = [];
  const missing = differenceKeys(definitions, values);

  if (missing.length > 0) {
    for (const key of missing) {
      const def = definitions[key];
      if (def !== WILDCARD) {
        errors.push({
          type: DIFF_TYPES.MISSING,
          definition: String(def),
          value: null,
          path: formatPath(key, prefix),
        });
      }
    }
  }

  return errors;
}

function checkExtra(
  definitions: ObjectOrArray,
  values: ObjectOrArray,
  prefix: string = '',
) {
  const errors: DiffError[] = [];
  const extra = differenceKeys(values, definitions);

  if (extra.length > 0) {
    for (const key of extra) {
      const val = values[key];
      errors.push(
        formatDiffError({
          type: DIFF_TYPES.EXTRA,
          value: val,
          path: formatPath(key, prefix),
        }),
      );
    }
  }

  return errors;
}

export function formatDiffError({
  type,
  definition,
  value,
  path,
}: {
  type: DIFF_TYPES;
  definition?: any;
  value?: any;
  path: string;
}) {
  return {
    type,
    definition: stringify(definition),
    value: stringify(value),
    path,
  };
}

function stringify(val: any): string {
  if (val instanceof Symbol) {
    return val.toString();
  }

  if (val instanceof RegExp) {
    return val.toString();
  }

  if (typeof val === 'function') {
    return val.toString();
  }

  if (typeof val === 'object' && val !== null) {
    return inspect(val, { colors: true });
  }

  return String(val);
}

// function stringify(val: any) {
//   if (val instanceof Symbol) {
//     return val.toString();
//   }
//
//   if (Array.isArray(val)) {
//     return `[${String(val)}]`;
//   }
//
//   if(typeof val === 'object') {
//     return val.toSource();
//     // return JSON.stringify(Object.keys(val).reduce((acc: any, key: any) => {
//     //   acc[key] = stringify(val[key]);
//     //   return acc;
//     // }, {} as any));
//   }
//
//   return String(val);
// }

function checkValues(
  definitions: ObjectOrArray,
  values: ObjectOrArray,
  validate: ValidateFn,
  prefix: string = '',
) {
  let errors: DiffError[] = [];

  const inter = intersectKeys(definitions, values);

  for (const key of inter) {
    const def = definitions[key];
    if (def !== WILDCARD) {
      const val = values[key];

      errors = [...errors, ...validate(def, val, formatPath(key, prefix))];
    }
  }

  return errors;
}

export function checkValue(
  definition: any,
  value: any,
  path: string,
): DiffError[] {
  const formatError = (type: DIFF_TYPES) => {
    return [formatDiffError({ type, definition, value, path })];
  };

  if (definition === WILDCARD) {
    return [];
  }

  if (definition instanceof RegExp) {
    return definition.test(value) !== true
      ? formatError(DIFF_TYPES.FAIL_MATCHING)
      : [];
  }

  if (typeof definition === 'function') {
    return definition(value) !== true
      ? formatError(DIFF_TYPES.FAIL_FUNCTION)
      : [];
  }

  return value !== definition ? formatError(DIFF_TYPES.FAIL_EQUALITY) : [];
}

function formatPath(path: string, prefix: string = '') {
  if (prefix === '') {
    return path;
  }

  return `${prefix}.${path}`;
}

function differenceKeys(a: ObjectOrArray, b: ObjectOrArray) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return difference(aKeys, bKeys);
}

function intersectKeys(a: ObjectOrArray, b: ObjectOrArray) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  return intersection(aKeys, bKeys);
}
