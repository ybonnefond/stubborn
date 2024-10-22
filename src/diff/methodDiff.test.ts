import { DIFF_SUBJECTS, DIFF_TYPES } from '../constants';
import { methodDiff } from './methodDiff';

describe('methodDiff', () => {
  function run(def: any, value: any) {
    return methodDiff(def, value);
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
