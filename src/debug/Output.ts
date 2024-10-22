import Color from 'chalk';

import { DiffError } from '../@types';
import { DIFF_SUBJECTS, DIFF_TYPES } from '../constants';

export class Output {
  private currentTab = 0;
  constructor(private output: string[] = []) {}

  public add(lines: string | string[]) {
    if (Array.isArray(lines)) {
      lines.forEach(line => this.add(line));
      return this;
    }

    this.output.push(lines);

    return this;
  }

  public category(cat: string) {
    const ucCat = cat[0].toUpperCase() + cat.slice(1);

    return this.add(Color.bold.underline(ucCat));
  }

  public newLine(count = 1) {
    for (let i = 0; i < count; i++) {
      this.add('');
    }

    return this;
  }

  public errorEq(error: DiffError) {
    const substration = `${this.substractionLabel(error)}: ${String(
      error.value,
    )}`;
    const addition = `${this.additionLabel(error)}: ${String(
      error.definition,
    )}`;
    this.add(this.substration(this.tab(substration)));
    this.add(this.addition(this.tab(addition)));
  }

  public errorMiss(error: DiffError) {
    const addition = `${this.additionLabel(error)}: ${String(
      error.definition,
    )}`;
    this.add(this.addition(this.tab(addition)));
  }

  public errorExt(error: DiffError) {
    const subtraction = `${this.substractionLabel(error)}: ${String(
      error.value,
    )}`;
    this.add(this.substration(this.tab(subtraction)));
  }

  public render() {
    return this.output.join('\n');
  }

  public pushTab() {
    this.currentTab++;
  }

  public pullTab() {
    this.currentTab--;
  }

  public addition(text: string) {
    return Color.green(`+ ${text}`);
  }

  public substration(text: string) {
    return Color.red(`- ${text}`);
  }

  public tab(text: string) {
    return ' '.repeat(this.currentTab * 2) + text;
  }

  public warn(message: string) {
    return this.add(`[${this.yellow('WARN')}] ${message}`);
  }

  public yellow(text: string) {
    return Color.yellow(text);
  }

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

    this.newLine();

    this.category(cat);
    errors.length === 1
      ? this.renderOneError(catErrors)
      : this.renderMultiplesErrors(catErrors);
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

  public renderOneError(errors: DiffError[]) {
    const error = errors.pop() as DiffError;
    this.renderError(error);
  }

  public renderMultiplesErrors(errors: DiffError[]) {
    this.pushTab();

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
        this.newLine();
      }

      this.renderError(e);
    });
    this.pullTab();
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
}
