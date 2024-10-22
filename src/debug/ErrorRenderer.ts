import { Output } from './Output';
import { DiffError } from '../@types';
import { DIFF_SUBJECTS, DIFF_TYPES } from '../constants';

export class ErrorRenderer {
  constructor(private output: Output) {}

  public renderErrors(
    subject: DIFF_SUBJECTS,
    errorsBySubjects: Record<DIFF_SUBJECTS, DiffError[]>,
  ) {
    const errors = errorsBySubjects[subject] ?? [];

    if (errors.length === 0) {
      return;
    }

    const cat = this.getDiffSubjectLabel(subject);

    const catErrors = errors.filter(e => e.subject === subject);

    this.output.newLine();

    this.output.category(cat);
    errors.length === 1
      ? this.renderOneError(catErrors)
      : this.renderMultiplesErrors(catErrors);
  }

  public renderOneError(errors: DiffError[]) {
    const error = errors.pop() as DiffError;
    this.renderError(error);
  }

  private getDiffSubjectLabel(subject: DIFF_SUBJECTS) {
    switch (subject) {
      case DIFF_SUBJECTS.METHOD:
        return 'Method';
      case DIFF_SUBJECTS.PATH:
        return 'Path';
      case DIFF_SUBJECTS.HEADERS:
        return 'Headers';
      case DIFF_SUBJECTS.QUERY:
        return 'Query';
      case DIFF_SUBJECTS.BODY:
        return 'Body';
      default:
        throw new Error(`Unknown subject: ${subject}`);
    }
  }

  public renderMultiplesErrors(errors: DiffError[]) {
    this.output.pushTab();

    errors.sort((a: DiffError, b: DiffError) => {
      const types = [
        DIFF_TYPES.MISSING,
        DIFF_TYPES.EXTRA,
        DIFF_TYPES.FAIL_EQUALITY,
        DIFF_TYPES.FAIL_MATCHING,
        DIFF_TYPES.FAIL_FUNCTION,
        DIFF_TYPES.INVALID_VALUE_TYPE,
      ];
      const aWeight = types.length - types.indexOf(a.type);
      const bWeight = types.length - types.indexOf(b.type);

      if (aWeight === bWeight) {
        return 0;
      }

      return aWeight > bWeight ? -1 : 1;
    });

    errors.forEach((e, i) => {
      if (i !== 0 && ![DIFF_TYPES.MISSING, DIFF_TYPES.EXTRA].includes(e.type)) {
        this.output.newLine();
      }

      this.renderError(e);
    });
    this.output.pullTab();
  }

  public renderError(error: DiffError) {
    switch (error.type) {
      case DIFF_TYPES.FAIL_EQUALITY:
        this.errorEq(error);
        break;
      case DIFF_TYPES.FAIL_MATCHING:
        this.errorEq(error);
        break;
      case DIFF_TYPES.FAIL_FUNCTION:
        this.errorEq(error);
        break;
      case DIFF_TYPES.MISSING:
        this.errorMiss(error);
        break;
      case DIFF_TYPES.EXTRA:
        this.errorExt(error);
        break;
      case DIFF_TYPES.INVALID_VALUE_TYPE:
        this.errorEq(error);
        break;
    }
  }

  private substractionLabel(error: DiffError) {
    return error.path === '' ? 'Received' : error.path;
  }

  private additionLabel(error: DiffError) {
    return error.path === '' ? 'Expected' : error.path;
  }

  public errorEq(error: DiffError) {
    const substration = `${this.substractionLabel(error)}: ${String(
      error.value,
    )}`;
    const addition = `${this.additionLabel(error)}: ${String(
      error.definition,
    )}`;
    this.output.add(this.output.substration(this.output.tab(substration)));
    this.output.add(this.output.addition(this.output.tab(addition)));
  }

  public errorMiss(error: DiffError) {
    const addition = `${this.additionLabel(error)}: ${String(
      error.definition,
    )}`;
    this.output.add(this.output.addition(this.output.tab(addition)));
  }

  public errorExt(error: DiffError) {
    const subtraction = `${this.substractionLabel(error)}: ${String(
      error.value,
    )}`;
    this.output.add(this.output.substration(this.output.tab(subtraction)));
  }
}
