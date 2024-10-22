import { DIFF_SUBJECTS, DiffError } from '../../src';

export function makeExpectDiffError(subject: DIFF_SUBJECTS) {
  return (error: unknown, expected: Partial<DiffError>[]): void => {
    const expectedErrors = expected.map(e => ({
      ...e,
      subject,
    }));

    expect(error).toEqual(expectedErrors);
  };
}
