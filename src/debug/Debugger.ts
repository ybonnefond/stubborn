import { DiffError, Request } from '../@types';

import { Route } from '../Route';
import { Output } from './Output';
import { requestDiff } from '../diff/requestDiff';
import { DIFF_SUBJECTS } from '../constants';
import { ErrorRenderer } from './ErrorRenderer';

export class Debugger {
  constructor(private request: Request) {}

  public getInfo() {
    return {
      method: this.request.method,
      path: this.request.path,
      headers: this.request.headers,
      query: this.request.query,
      body: this.request.body,
      hash: this.request.hash,
    };
  }

  public warnLogDiffOnMatched(route: Route) {
    const out = new Output();

    out.add(`## Request: ${this.request.method} ${this.request.path}`);

    out.warn('Detected logDiffOn501 on a matched route without error ');
    out.add(out.yellow('Did you forget to remove the call to logDiffOn501?'));
    const position = route.getLogDiffPosition();
    if (position !== null) {
      out.pushTab();
      out.add(out.tab(out.yellow(`at ${out.formatLineInfo(position)}`)));
      out.pullTab();
    }
    out.newLine(2);

    process.stdout.write(out.render());
  }

  public logDiff(route: Route) {
    const out = new Output();
    const render = new ErrorRenderer(out);

    const diff = requestDiff(route, this.request);

    const errors = diff.reduce((acc, error) => {
      if (!acc[error.subject]) {
        acc[error.subject] = [];
      }

      acc[error.subject].push(error);

      return acc;
    }, {} as Record<string, DiffError[]>);

    out.add(
      `## Route: ${out.blue(out.bold(this.request.method))} ${out.cyan(
        this.request.path,
      )}`,
    );
    out.pushTab();
    out.add(out.tab(`at ${out.formatLineInfo(route.getInitializerPath())}`));
    out.pullTab();

    render.renderErrors(DIFF_SUBJECTS.METHOD, errors);
    render.renderErrors(DIFF_SUBJECTS.PATH, errors);
    render.renderErrors(DIFF_SUBJECTS.HEADERS, errors);
    render.renderErrors(DIFF_SUBJECTS.QUERY, errors);
    render.renderErrors(DIFF_SUBJECTS.BODY, errors);

    process.stdout.write(out.render());
  }
}
