import { STATUS_CODES, WILDCARD } from '../../src';
import { test } from '../test';
import { HttpClientRequest, HttpClientResponse } from '../helpers/httpClient';

describe('README examples', () => {
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should respond to query', async () => {
    const body = { some: 'body' };
    sb.get('/').setResponseBody({ some: 'body' });

    const res = await request({ path: '/' });

    expectStatus(res, STATUS_CODES.SUCCESS);
    expect(res.data).toEqual(body);
  });

  it('should respond 501 if a parameter is missing', async () => {
    sb.get('/').setQueryParameters({ page: '1' });

    const res = await request({ path: `/` });

    expectStatus(res, STATUS_CODES.NOT_IMPLEMENTED);
  });

  it('should respond 501 if a parameter is added', async () => {
    sb.get('/').setQueryParameters({ page: '1' });

    const res = await request({ query: { page: '1', limit: '10' } });

    expectStatus(res, STATUS_CODES.NOT_IMPLEMENTED);
  });

  it('should respond 501 if a parameter is not equal', async () => {
    sb.get('/').setQueryParameters({ page: '1' });

    const res = await request({ query: { page: '2' } });

    expectStatus(res, STATUS_CODES.NOT_IMPLEMENTED);
  });

  it('should respond using WILDCARD for parameter and headers', async () => {
    sb.get('/').setQueryParameters({ page: WILDCARD }).setHeaders(WILDCARD);

    const res = await request({
      query: { page: '2' },
      headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' },
    });

    expectStatus(res, STATUS_CODES.SUCCESS);
  });

  it('should match using regex', async () => {
    sb.post('/', {
      slug: /^[a-z\-]*$/,
    })
      .setQueryParameters({ page: /^\d$/ })
      .setHeaders(WILDCARD)
      .logDiffOn501();

    const res = await request({
      query: { page: '2' },
      method: 'POST',
      data: { slug: 'stubborn-ws' },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expectStatus(res, STATUS_CODES.SUCCESS);
  });

  it('should match using a function', async () => {
    sb.get('/').setQueryParameters({
      page: value => parseInt(value as string, 10) > 0,
    });

    const res = await request({ query: { page: '2' } });

    expectStatus(res, STATUS_CODES.SUCCESS);
  });

  function expectStatus(res: HttpClientResponse, expectedStatus: STATUS_CODES) {
    expect(res.status).toBe(expectedStatus);
  }

  function request(options: HttpClientRequest) {
    return httpClient.request({
      method: 'GET',
      responseType: 'json',
      path: '/',
      ...options,
    });
  }
});
