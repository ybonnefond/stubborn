import { Request } from '../@types';
import { bodyDiff } from '../diff/bodyDiff';
import { headersDiff } from '../diff/headersDiff';
import { methodDiff } from '../diff/methodDiff';
import { pathDiff } from '../diff/pathDiff';
import { queryDiff } from '../diff/queryDiff';
import { Route } from '../Route';
import { Output } from './Output';

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

  public logDiff(route: Route) {
    const out = new Output();

    out.renderErrors(
      'Method',
      methodDiff(route.getMethod(), this.request.method),
    );
    out.renderErrors('Path', pathDiff(route.getPath(), this.request.path));
    out.renderErrors(
      'Headers',
      headersDiff(route.getHeaders(), this.request.headers),
    );
    out.renderErrors(
      'Query',
      queryDiff(route.getQueryParameters(), this.request.query),
    );
    const body =
      this.request.body instanceof Buffer
        ? String(this.request.body)
        : this.request.body;
    out.renderErrors('Body', bodyDiff(route.getBody(), body));

    // tslint:disable-next-line:no-console
    console.log(out.render());
  }
}
