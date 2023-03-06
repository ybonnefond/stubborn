import { Stubborn } from '../src';
import { HttpClient } from './helpers/httpClient';

class Test {
  private sb: Stubborn = new Stubborn();
  private httpClient = new HttpClient(this.sb);

  public async setup() {
    await this.sb.start();
  }

  public async tearDown() {
    await this.getStubbornInstance().stop();
  }

  public clean() {
    this.getStubbornInstance().clear();
  }

  public getHttpClient() {
    return this.httpClient;
  }

  public getStubbornInstance(): Stubborn {
    if (this.sb === null) {
      throw new Error('Setup method not called');
    }

    return this.sb;
  }
}

export const test = new Test();
