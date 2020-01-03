import got from 'got';

import { Stubborn } from '../../src/index';

export function init() {
  const sb = new Stubborn();

  beforeAll(async () => await sb.start());
  afterAll(async () => await sb.stop());
  beforeEach(async () => await sb.clear());

  function request(path = '/', options = {}) {
    return got(`${sb.getOrigin()}${path}`, {
      method: 'GET',
      responseType: 'json',
      throwHttpErrors: false,
      ...options,
    });
  }

  return { sb, request };
}
