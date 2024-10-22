import { WILDCARD } from '../../src';

import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('Call Counter', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should have no calls when initialize the route', () => {
    const route = sb.get('/');
    expect(route.countCalls()).toBe(0);
  });

  it('should retain every calls made to the route', async () => {
    const route = sb.get('/');

    const TOTAL_CALLS = 3;

    for (let i = 1; i <= TOTAL_CALLS; i++) {
      await httpClient.request({ path: '/' });
      expect(route.countCalls()).toBe(i);
    }
  });

  it('should retain a striped version of the httpClient.request', async () => {
    const route = sb
      .post('/', WILDCARD)
      .setHeaders(WILDCARD)
      .setQueryParameters(WILDCARD);

    await httpClient.request({
      query: { page: '100' },
      method: 'POST',
      data: { some: 'body' },
      headers: { 'content-type': 'application/json' },
    });

    expect(route.countCalls()).toBe(1);
    expect(route.getCall(0)).toEqual({
      method: 'POST',
      query: { page: '100' },
      body: { some: 'body' },
      path: '/',
      hash: '',
      headers: {
        accept: 'application/json',
        'accept-encoding': expect.any(String),
        connection: expect.any(String),
        'content-length': expect.any(String),
        'content-type': 'application/json',
        host: expect.any(String),
        'user-agent': expect.any(String),
      },
    });
  });
});
