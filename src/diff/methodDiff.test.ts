import { DIFF_SUBJECTS, DIFF_TYPES, METHODS } from '../constants';
import { methodDiff } from './methodDiff';
import { Route } from '../Route';
import { makeRequestInfo } from '../../test';

describe('methodDiff', () => {
  function run(def: any, value: any) {
    const route = new Route(METHODS.GET, '/').setHeaders(def);
    const request = makeRequestInfo({ method: value });
    return methodDiff(route, request);
  }

  function expectNoErrors(def: any, value: any) {
    const errors = run(def, value);
    expect(errors).toEqual([]);
  }

  function expectError(def: any, value: any, type: DIFF_TYPES) {
    const errors = run(def, value);

    expect(errors).toEqual([
      {
        subject: DIFF_SUBJECTS.METHOD,
        type,
        definition: String(def),
        value,
        path: '',
      },
    ]);
  }

  describe('with string definition', () => {
    it.each([
      ['get', 'get'],
      ['GET', 'get'],
      ['get', 'GET'],
      ['Get', 'gEt'],
    ])('should pass if using def %s dans value %s', (def, value) => {
      expectNoErrors(def, value);
    });

    it('should return an error if requested does not equal definition', () => {
      expectError('get', 'post', DIFF_TYPES.FAIL_EQUALITY);
    });
  });
});
