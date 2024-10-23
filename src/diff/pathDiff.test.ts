import { JsonValue } from '../@types';
import { DIFF_SUBJECTS, DIFF_TYPES, METHODS } from '../constants';
import { pathDiff } from './pathDiff';
import { Route } from '../Route';
import { makeRequestInfo } from '../../test';

describe('pathDiff', () => {
  function run(def: any, value: any) {
    const route = new Route(METHODS.GET, def);
    const request = makeRequestInfo({ path: value });
    return pathDiff(route, request);
  }

  function expectNoErrors(def: any, value: any) {
    const errors = run(def, value);
    expect(errors).toEqual([]);
  }

  function expectError(def: any, value: any, type: DIFF_TYPES) {
    const errors = run(def, value);

    expect(errors).toEqual([
      {
        subject: DIFF_SUBJECTS.PATH,
        type,
        definition: String(def),
        value,
        path: '',
      },
    ]);
  }

  describe('with string definition', () => {
    it('should pass if requested equals definition', () => {
      expectNoErrors('/', '/');
    });

    it('should fail if requested does not equal definition', () => {
      expectError('/def', '/', DIFF_TYPES.FAIL_EQUALITY);
    });

    it('should fail if case does not match', () => {
      expectError('/DEF', '/def', DIFF_TYPES.FAIL_EQUALITY);
    });
  });

  describe('with Regexp definition', () => {
    it('should pass if requested matches definition', () => {
      expectNoErrors(/my-path/, '/this/is/my-path');
    });

    it('should fail if requested does not match definition', () => {
      expectError(/my-path/, '/this/is/not/my/path', DIFF_TYPES.FAIL_MATCHING);
    });
  });

  describe('with function definition', () => {
    it('should pass if requested pass definition function', () => {
      expectNoErrors((val: JsonValue) => val === '/my-path', '/my-path');
    });

    it('should fail if requested does not pass definition function', () => {
      expectError(
        (val: JsonValue) => val === '/my-path',
        '/not-my-path',
        DIFF_TYPES.FAIL_FUNCTION,
      );
    });
  });
});
