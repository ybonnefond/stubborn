import { JsonValue } from '../@types';
import { DIFF_TYPES, WILDCARD } from '../constants';
import { queryDiff } from './queryDiff';

describe('queryDiff', () => {
  const POSITIVE_INT_REGEXP = /^[0-9]+$/;
  const POSITIVE_INT_REGEXP_STRING = String(POSITIVE_INT_REGEXP);

  describe('with extra or missing parameter', () => {
    it('should fail if parameter is missing', () => {
      const errors = queryDiff({ limit: POSITIVE_INT_REGEXP }, {});
      expect(errors).toEqual([
        {
          definition: POSITIVE_INT_REGEXP_STRING,
          path: 'limit',
          type: DIFF_TYPES.MISSING,
          value: null,
        },
      ]);
    });

    it('should fail if parameter is extra', () => {
      const errors = queryDiff({}, { page: '12' });
      expect(errors).toEqual([
        {
          definition: 'undefined',
          path: 'page',
          type: DIFF_TYPES.EXTRA,
          value: '12',
        },
      ]);
    });

    it('should fail with both missing and extra parameters', () => {
      const errors = queryDiff({ page: POSITIVE_INT_REGEXP }, { limit: '12' });
      expect(errors).toEqual([
        {
          definition: POSITIVE_INT_REGEXP_STRING,
          path: 'page',
          type: DIFF_TYPES.MISSING,
          value: null,
        },
        {
          definition: 'undefined',
          path: 'limit',
          type: DIFF_TYPES.EXTRA,
          value: '12',
        },
      ]);
    });
  });

  describe('using wildcard', () => {
    it('should pass if query is wildcarded', () => {
      const errors = queryDiff(WILDCARD, { page: '12' });
      expect(errors).toEqual([]);
    });

    it('should pass if a parameter is wildcarded', () => {
      const errors = queryDiff({ page: WILDCARD }, { page: '123' });
      expect(errors).toEqual([]);
    });

    it('should fail if a parameter is wildcarded and case is different', () => {
      const errors = queryDiff({ page: WILDCARD }, { PAGE: '16' });
      expect(errors).toEqual([
        {
          definition: 'undefined',
          path: 'PAGE',
          type: DIFF_TYPES.EXTRA,
          value: '16',
        },
      ]);
    });

    it('should pass if a parameter is wildcarded and NOT in request', () => {
      const errors = queryDiff({ page: WILDCARD }, {});
      expect(errors).toEqual([]);
    });

    it('should pass if a parameter is wildcarded and param with multiple values', () => {
      const errors = queryDiff({ page: WILDCARD }, { page: ['10', 'abc'] });
      expect(errors).toEqual([]);
    });
  });

  describe('with string definition', () => {
    it('should fail if value is not equal to definition', () => {
      const errors = queryDiff({ page: '10' }, { page: '11' });
      expect(errors).toEqual([
        {
          definition: '10',
          path: 'page',
          type: DIFF_TYPES.FAIL_EQUALITY,
          value: '11',
        },
      ]);
    });

    it('should fail if one value is not equal to definition', () => {
      const errors = queryDiff(
        { page: '10' },
        { page: ['10', '11', '10', '15'] },
      );
      expect(errors).toEqual([
        {
          definition: '10',
          path: 'page.1',
          type: DIFF_TYPES.FAIL_EQUALITY,
          value: '11',
        },
        {
          definition: '10',
          path: 'page.3',
          type: DIFF_TYPES.FAIL_EQUALITY,
          value: '15',
        },
      ]);
    });

    it('should pass if value is equal to definition', () => {
      const errors = queryDiff({ page: '10' }, { page: '10' });
      expect(errors).toEqual([]);
    });

    it('should pass if all values are equal to definition', () => {
      const errors = queryDiff({ page: '10' }, { page: ['10', '10', '10'] });
      expect(errors).toEqual([]);
    });

    it('should pass if all values are equal to all definitions', () => {
      const errors = queryDiff(
        { page: ['20', '10', '22'] },
        { page: ['20', '10', '22'] },
      );
      expect(errors).toEqual([]);
    });

    it('should fail if definition is an array and value is not', () => {
      const errors = queryDiff({ page: ['20', '10', '22'] }, { page: '12' });
      expect(errors).toEqual([
        {
          definition: '[20,10,22]',
          path: 'page',
          type: DIFF_TYPES.INVALID_VALUE_TYPE,
          value: '12',
        },
      ]);
    });

    it('should fail if there are less values than definitions', () => {
      const errors = queryDiff({ page: ['20'] }, { page: ['20', '10', '22'] });
      expect(errors).toEqual([
        {
          definition: 'undefined',
          path: 'page.1',
          type: DIFF_TYPES.EXTRA,
          value: '10',
        },
        {
          definition: 'undefined',
          path: 'page.2',
          type: DIFF_TYPES.EXTRA,
          value: '22',
        },
      ]);
    });

    it('should fail if there are less values than definitions', () => {
      const errors = queryDiff({ page: ['20', '10', '22'] }, { page: ['20'] });
      expect(errors).toEqual([
        {
          definition: '10',
          path: 'page.1',
          type: DIFF_TYPES.MISSING,
          value: null,
        },
        {
          definition: '22',
          path: 'page.2',
          type: DIFF_TYPES.MISSING,
          value: null,
        },
      ]);
    });
  });

  describe('with RexExp definition', () => {
    it('should fail if value does not match definition', () => {
      const errors = queryDiff({ page: POSITIVE_INT_REGEXP }, { page: 'abc' });
      expect(errors).toEqual([
        {
          definition: POSITIVE_INT_REGEXP_STRING,
          path: 'page',
          type: DIFF_TYPES.FAIL_MATCHING,
          value: 'abc',
        },
      ]);
    });

    it('should pass if value matches definition', () => {
      const errors = queryDiff({ page: POSITIVE_INT_REGEXP }, { page: '10' });
      expect(errors).toEqual([]);
    });
  });

  describe('with function definition', () => {
    const fn = (val: JsonValue) => parseInt(val as string, 10) > 10;
    const fnString = String(fn);

    it('should fail if value does not pass function definition', () => {
      const errors = queryDiff({ page: fn }, { page: '5' });
      expect(errors).toEqual([
        {
          definition: fnString,
          path: 'page',
          type: DIFF_TYPES.FAIL_FUNCTION,
          value: '5',
        },
      ]);
    });

    it('should pass if value passes function definition', () => {
      const errors = queryDiff({ page: fn }, { page: '11' });
      expect(errors).toEqual([]);
    });
  });
});
