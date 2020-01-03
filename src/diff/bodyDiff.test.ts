import { BodyDefinition, JsonValue, RequestBody } from '../@types';
import { DIFF_TYPES, WILDCARD } from '../constants';
import { bodyDiff } from './bodyDiff';

describe('bodyDiff', () => {
  const LC_STRING = /^[a-z]+$/;
  const END_WITH_LO = (val: JsonValue) => (val as string).endsWith('lo');

  it.each([
    // Empty values
    ['', ''],
    [null, null],
    [undefined, undefined],
    [{}, {}],

    // strings
    ['test', 'test'],

    // number
    [12, 12],

    // Using wildcard
    [WILDCARD, 'test'],
    [WILDCARD, undefined],
    [WILDCARD, null],
    [WILDCARD, 12],
    [WILDCARD, {}],
    [WILDCARD, { test: 'test' }],
    [WILDCARD, []],
    [WILDCARD, ['one', 'two']],

    // Using wildcard in object
    [{ key: WILDCARD }, { key: 'test' }],
    [{ key: WILDCARD }, { key: ['one'] }],
    [{ key: WILDCARD }, { key: { subkey: 'hello' } }],
    [
      { key: { a: 'b', subkey: WILDCARD } },
      { key: { a: 'b', subkey: 'hello' } },
    ],

    // Using wildcard in array
    [[WILDCARD], ['1']],
    [
      [WILDCARD, '2', '3'],
      ['1', '2', '3'],
    ],
    [
      ['1', WILDCARD, '3'],
      ['1', '2', '3'],
    ],
    [
      ['1', '2', WILDCARD],
      ['1', '2', '3'],
    ],

    // Deep object
    [
      { a: { b: { c: { d: { e: 'e' } } } } },
      { a: { b: { c: { d: { e: 'e' } } } } },
    ],

    // Arrays
    [
      ['one', 'two'],
      ['one', 'two'],
    ],

    // RegExp
    [LC_STRING, 'hello'],
    [[LC_STRING], ['hello']],
    [{ key: LC_STRING }, { key: 'hello' }],
    [{ a: { b: { c: LC_STRING } } }, { a: { b: { c: 'hello' } } }],

    // Function
    [END_WITH_LO, 'hello'],
    [[END_WITH_LO], ['hello']],
    [{ key: END_WITH_LO }, { key: 'hello' }],
    [{ a: { b: { c: END_WITH_LO } } }, { a: { b: { c: 'hello' } } }],
  ])('should pass with def %p and value %p', (...args) => {
    const [def, val] = args;
    const result = bodyDiff(def as BodyDefinition, val);
    expect(result).toEqual([]);
  });

  describe('missing keys', () => {
    it('should fail keys are missing in root', () => {
      const def = {
        a: 'a',
        b: 'b',
      };
      const val = {
        a: 'a',
      };
      const result = bodyDiff(def, val);
      expect(result).toEqual([
        {
          type: DIFF_TYPES.MISSING,
          path: 'b',
          definition: 'b',
          value: null,
        },
      ]);
    });

    it('should fail keys are missing in depth', () => {
      const def = {
        a: {
          b: {
            c: {
              d: 'd',
              e: 'e',
            },
          },
        },
      };
      const val = {
        a: {
          b: {
            c: {
              e: 'e',
            },
          },
        },
      };
      const result = bodyDiff(def, val);
      expect(result).toEqual([
        {
          type: DIFF_TYPES.MISSING,
          path: 'a.b.c.d',
          definition: 'd',
          value: null,
        },
      ]);
    });
  });

  describe('extra keys', () => {
    it('should fail if extra keys in root', () => {
      const def = {
        a: 'a',
      };
      const val = {
        a: 'a',
        b: 'b',
      };
      const result = bodyDiff(def, val);
      expect(result).toEqual([
        {
          type: DIFF_TYPES.EXTRA,
          path: 'b',
          definition: 'undefined',
          value: 'b',
        },
      ]);
    });

    it('should fail if extra keys in depth', () => {
      const def = {
        a: {
          b: {
            c: {
              d: 'd',
            },
          },
        },
      };
      const val = {
        a: {
          b: {
            c: {
              d: 'd',
              e: 'e',
            },
          },
        },
      };
      const result = bodyDiff(def, val);
      expect(result).toEqual([
        {
          type: DIFF_TYPES.EXTRA,
          path: 'a.b.c.e',
          definition: 'undefined',
          value: 'e',
        },
      ]);
    });
  });

  describe('fail', () => {
    it.each(
      // prettier-ignore
      [
        // Primitives
        [
          'a', 'b',
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '', definition: 'a', value: 'b' }
        ],
        [
          undefined, 'b',
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '', definition: 'undefined', value: 'b' }
        ],
        [
          null, 'b',
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '', definition: 'null', value: 'b' }
        ],
        [
          'a', undefined,
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '', definition: 'a', value: 'undefined' }
        ],
        [
          'a', null,
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '', definition: 'a', value: 'null' }
        ],
        [
          'a', 12,
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '', definition: 'a', value: '12' }
        ],

        // array
        [
          ['a'], ['b'],
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '0', definition: 'a', value: 'b' }
        ],
        [
          [0, 'r', 2], [0, 'b', 2],
          { type: DIFF_TYPES.FAIL_EQUALITY, path: '1', definition: 'r', value: 'b' }
        ],

        // object
        [
          {a: 'test'}, {a: 'toast'},
          { type: DIFF_TYPES.FAIL_EQUALITY, path: 'a', definition: 'test', value: 'toast' }
        ],
        [
          {a: /test/}, {a: 'toast'},
          { type: DIFF_TYPES.FAIL_MATCHING, path: 'a', definition: '/test/', value: 'toast' }
        ],
        [
          {a: (val: any) => val === 'test'}, {a: 'toast'},
          { type: DIFF_TYPES.FAIL_FUNCTION, path: 'a', definition: '(val) => val === \'test\'', value: 'toast' }
        ],
    ],
    )('should fail if def %p not equal val %p', (...args) => {
      const [def, val, error] = args;
      const result = bodyDiff(def as BodyDefinition, val as RequestBody);
      expect(result).toEqual([error]);
    });
  });
});
