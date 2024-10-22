import { difference, intersection } from 'lodash';

import { DiffError } from '../@types';
import { DIFF_SUBJECTS, DIFF_TYPES, WILDCARD } from '../constants';
import { inspect } from '../inspect';

type ObjectOrArray = Record<string | number, any>;
export type ValidateFn = (params: {
  subject: DIFF_SUBJECTS;
  definition: any;
  value: any;
  path: string;
}) => DiffError[];

export function findErrors({
  subject,
  definition,
  value,
  validate,
  prefix,
}: {
  subject: DIFF_SUBJECTS;
  definition: any;
  value: any;
  validate: ValidateFn;
  prefix: string;
}): DiffError[] {
  if (definition === WILDCARD) {
    return [];
  }

  if (typeof definition === 'object' && definition !== null) {
    return findErrorsObject({ subject, definition, value, validate, prefix });
  }

  return checkValues({ subject, definition, value, validate, prefix });
}

function findErrorsObject({
  subject,
  definition,
  value,
  validate,
  prefix,
}: {
  subject: DIFF_SUBJECTS;
  definition: ObjectOrArray;
  value: any;
  validate: ValidateFn;
  prefix: string;
}) {
  const isValueObject = typeof value === 'object' && value !== null;
  if (!isValueObject) {
    return [
      formatDiffError({
        subject,
        type: DIFF_TYPES.INVALID_VALUE_TYPE,
        definition,
        value,
        path: prefix,
      }),
    ];
  }

  return [
    ...checkMissing({ subject, definition, value, prefix }),
    ...checkExtra({ subject, definition, value, prefix }),
    ...checkValues({ subject, definition, value, validate, prefix }),
  ];
}

function checkMissing({
  subject,
  definition,
  value,
  prefix,
}: {
  subject: DIFF_SUBJECTS;
  definition: ObjectOrArray;
  value: ObjectOrArray;
  prefix: string;
}) {
  const errors: DiffError[] = [];
  const missing = differenceKeys(definition, value);

  if (missing.length > 0) {
    for (const key of missing) {
      const def = definition[key];
      if (def !== WILDCARD) {
        errors.push({
          subject,
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

function checkExtra({
  subject,
  definition,
  value,
  prefix,
}: {
  subject: DIFF_SUBJECTS;
  definition: ObjectOrArray;
  value: ObjectOrArray;
  prefix: string;
}) {
  const errors: DiffError[] = [];
  const extra = differenceKeys(value, definition);

  if (extra.length > 0) {
    for (const key of extra) {
      const val = value[key];
      errors.push(
        formatDiffError({
          subject,
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
  subject,
  type,
  definition,
  value,
  path,
}: {
  subject: DIFF_SUBJECTS;
  type: DIFF_TYPES;
  definition?: any;
  value?: any;
  path: string;
}): DiffError {
  return {
    subject,
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

function checkValues({
  subject,
  definition,
  value,
  validate,
  prefix,
}: {
  subject: DIFF_SUBJECTS;
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
        ...validate({
          subject,
          definition: def,
          value: val,
          path: formatPath({ path: key, prefix }),
        }),
      ];
    }
  }

  return errors;
}

export function checkValue({
  subject,
  definition,
  value,
  path,
}: {
  subject: DIFF_SUBJECTS;
  definition: any;
  value: any;
  path: string;
}): DiffError[] {
  const formatError = (type: DIFF_TYPES) => {
    return [formatDiffError({ subject, type, definition, value, path })];
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
