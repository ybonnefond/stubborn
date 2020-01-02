import { JsonValue } from '../@types';
import { DIFF_TYPES, WILDCARD } from '../constants';
import { headersDiff } from './headersDiff';

describe('headersDiff', () => {
  describe('with extra or missing headers', () => {
    it('should fail if header is missing', () => {
      const errors = headersDiff({ authorization: /^Bearer/ }, {});
      expect(errors).toEqual([
        {
          definition: '/^Bearer/',
          path: 'authorization',
          type: DIFF_TYPES.MISSING,
          value: null,
        },
      ]);
    });

    it('should fail if header is extra', () => {
      const errors = headersDiff({}, { authorization: 'Bearer 123' });
      expect(errors).toEqual([
        {
          definition: 'undefined',
          path: 'authorization',
          type: DIFF_TYPES.EXTRA,
          value: 'Bearer 123',
        },
      ]);
    });

    it('should fail with both missing and extra headers', () => {
      const errors = headersDiff(
        { accept: 'application/json' },
        { authorization: 'Bearer 456' },
      );
      expect(errors).toEqual([
        {
          definition: 'application/json',
          path: 'accept',
          type: DIFF_TYPES.MISSING,
          value: null,
        },
        {
          definition: 'undefined',
          path: 'authorization',
          type: DIFF_TYPES.EXTRA,
          value: 'Bearer 456',
        },
      ]);
    });
  });

  describe('using wildcard', () => {
    it('should pass if headers are wildcarded', () => {
      const errors = headersDiff(WILDCARD, { authorization: 'basic 123' });
      expect(errors).toEqual([]);
    });

    it('should pass if a header is wildcarded', () => {
      const errors = headersDiff(
        { authorization: WILDCARD },
        { authorization: 'basic 123' },
      );
      expect(errors).toEqual([]);
    });

    it('should pass if a header is wildcarded and case is different', () => {
      const errors = headersDiff(
        { authorization: WILDCARD },
        { AUTHORIZATION: 'basic 123' },
      );
      expect(errors).toEqual([]);
    });

    it('should pass if a header is wildcarded and NOT in request', () => {
      const errors = headersDiff({ authorization: WILDCARD }, {});
      expect(errors).toEqual([]);
    });
  });

  describe('with string definition', () => {
    it('should fail if value is not equal to definition', () => {
      const errors = headersDiff(
        { accept: 'application/json' },
        { accept: 'application/text' },
      );
      expect(errors).toEqual([
        {
          definition: 'application/json',
          path: 'accept',
          type: DIFF_TYPES.FAIL_EQUALITY,
          value: 'application/text',
        },
      ]);
    });

    it('should pass if value is equal to definition', () => {
      const errors = headersDiff(
        { accept: 'application/json' },
        { accept: 'application/json' },
      );
      expect(errors).toEqual([]);
    });

    it('should pass if value is equal to definition and header case is different', () => {
      const errors = headersDiff(
        { accept: 'application/json' },
        { Accept: 'application/json' },
      );
      expect(errors).toEqual([]);
    });
  });

  describe('with RexExp definition', () => {
    it('should fail if value does not match definition', () => {
      const errors = headersDiff(
        { accept: /json/ },
        { accept: 'application/text' },
      );
      expect(errors).toEqual([
        {
          definition: '/json/',
          path: 'accept',
          type: DIFF_TYPES.FAIL_MATCHING,
          value: 'application/text',
        },
      ]);
    });

    it('should pass if value matches definition', () => {
      const errors = headersDiff(
        { accept: /json/ },
        { accept: 'application/json' },
      );
      expect(errors).toEqual([]);
    });
  });

  describe('with function definition', () => {
    it('should fail if value does not pass function definition', () => {
      const fn = (val: JsonValue) => (val as string).endsWith('json');
      const fnString = String(fn);

      const errors = headersDiff(
        { accept: fn },
        { accept: 'application/text' },
      );
      expect(errors).toEqual([
        {
          definition: fnString,
          path: 'accept',
          type: DIFF_TYPES.FAIL_FUNCTION,
          value: 'application/text',
        },
      ]);
    });

    it('should pass if value passes function definition', () => {
      const errors = headersDiff(
        { accept: (val: JsonValue) => (val as string).endsWith('json') },
        { accept: 'application/json' },
      );
      expect(errors).toEqual([]);
    });
  });
});
