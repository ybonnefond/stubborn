import { difference, intersection } from 'lodash';

import { DiffError } from '../@types';
import { DIFF_TYPES, WILDCARD } from '../constants';
import { inspect } from '../inspect';

type ObjectOrArray = Record<string | number, any>;
type ValidateFn = (definition: any, value: any, path: string) => DiffError[];

export function findErrors(
  definition: any,
  value: any,
  validate: ValidateFn,
  prefix: string = '',
): DiffError[] {
  if (definition === WILDCARD) {
    return [];
  }

  if (typeof definition === 'object' && definition !== null) {
    return findErrorsObject(definition, value, validate, prefix);
  }

  return checkValues({ definition, value, validate, prefix });
}

function findErrorsObject(
  definition: ObjectOrArray,
  value: any,
  validate: ValidateFn,
  prefix: string = '',
) {
  const isValueObject = typeof value === 'object' && value !== null;
  if (!isValueObject) {
    return [
      formatDiffError({
        type: DIFF_TYPES.INVALID_VALUE_TYPE,
        definition,
        value,
        path: prefix,
      }),
    ];
  }

  return [
    ...checkMissing(definition, value, prefix),
    ...checkExtra(definition, value, prefix),
    ...checkValues({ definition, value, validate, prefix }),
  ];
}

function checkMissing(
  definition: ObjectOrArray,
  value: ObjectOrArray,
  prefix: string = '',
) {
  const errors: DiffError[] = [];
  const missing = differenceKeys(definition, value);

  if (missing.length > 0) {
    for (const key of missing) {
      const def = definition[key];
      if (def !== WILDCARD) {
        errors.push({
          type: DIFF_TYPES.MISSING,
          definition: String(def),
          value: null,
          path: formatPath({ path: key, prefix }),
        });
      }
    }
  }

  return errors;
}

function checkExtra(
  definition: ObjectOrArray,
  value: ObjectOrArray,
  prefix: string = '',
) {
  const errors: DiffError[] = [];
  const extra = differenceKeys(value, definition);

  if (extra.length > 0) {
    for (const key of extra) {
      const val = value[key];
      errors.push(
        formatDiffError({
          type: DIFF_TYPES.EXTRA,
          value: val,
          path: formatPath({ path: key, prefix }),
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

function checkValues({
  definition,
  value,
  validate,
  prefix,
}: {
  definition: ObjectOrArray;
  value: ObjectOrArray;
  validate: ValidateFn;
  prefix?: string;
}) {
  let errors: DiffError[] = [];

  const inter = intersectKeys(definition, value);

  for (const key of inter) {
    const def = definition[key];
    if (def !== WILDCARD) {
      const val = value[key];

      errors = [
        ...errors,
        ...validate(def, val, formatPath({ path: key, prefix })),
      ];
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

function formatPath({ path, prefix }: { path: string; prefix?: string }) {
  const isValidPrefix = typeof prefix === 'string' && prefix.length > 0;
  if (!isValidPrefix) {
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
