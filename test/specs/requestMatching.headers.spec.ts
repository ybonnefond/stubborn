import { WILDCARD } from '../../src';

import { STATUS_CODES } from '../../src';

import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('Request matching Headers', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should return SUCCESS if headers are wildcarded', async () => {
    sb.get('/').setHeaders(WILDCARD);

    expect(
      await httpClient.request({
        headers: { Authorization: 'token' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return NOT_IMPLEMENTED if header is not in definition', async () => {
    sb.get('/');

    expect(
      await httpClient.request({
        headers: { Authorization: 'token' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return NOT_IMPLEMENTED if header in definition is not provided', async () => {
    sb.get('/').setHeaders({ Authorization: 'token' });

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
  });

  it('should return NOT_IMPLEMENTED if headers name are different', async () => {
    sb.get('/').setHeaders({ Authorization: 'token' });

    expect(
      await httpClient.request({
        headers: { 'x-api-key': 'api-key' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return NOT_IMPLEMENTED if headers values are different', async () => {
    sb.get('/').setHeaders({ Authorization: 'token' });

    expect(
      await httpClient.request({
        headers: { Authorization: 'not-token' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return SUCCESS if header is WILDCARD and in request', async () => {
    sb.get('/').setHeaders({ Authorization: WILDCARD });

    expect(
      await httpClient.request({
        headers: { Authorization: 'token' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if header is WILDCARD and not in request', async () => {
    sb.get('/').setHeaders({ Authorization: WILDCARD });

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if header is strictly equal to the definition', async () => {
    sb.get('/').setHeaders({ Authorization: 'token' });

    expect(
      await httpClient.request({
        headers: { Authorization: 'token' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if header is strictly equal to the definition and case is different', async () => {
    sb.get('/').setHeaders({ Authorization: 'token' });

    expect(
      await httpClient.request({
        headers: { AUTHORIZATION: 'token' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return NOT_IMPLEMENTED if header does not match the definition', async () => {
    sb.get('/').setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

    expect(
      await httpClient.request({
        headers: { Authorization: 'Bearer 11' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return SUCCESS if header match a regexp', async () => {
    sb.get('/').setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

    expect(
      await httpClient.request({
        headers: { Authorization: 'Bearer 9' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if header match a custom function', async () => {
    sb.get('/').setHeaders({
      Authorization: header => header === 'Bearer 9',
    });

    expect(
      await httpClient.request({
        headers: { Authorization: 'Bearer 9' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS when setting a specific header', async () => {
    sb.get('/').setHeader('Authorization', 'Bearer 9');

    expect(
      await httpClient.request({
        headers: { Authorization: 'Bearer 9' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should convert json if JSON Accept header', async () => {
    sb.post('/', '{"key": "value"}').setResponseBody({ key: 'ok' });

    const res = await httpClient.request({
      method: 'POST',
      data: '{"key": "value"}',
      responseType: 'text',
      headers: { Accept: 'application/vnd.api+json' },
    });
    expect(res).toReplyWith({ status: STATUS_CODES.SUCCESS });

    const body = JSON.parse(res.data as string);
    expect(body).toStrictEqual({ key: 'ok' });
  });

  it('should support AWS json 1.0 content type and parse body', async () => {
    sb.post('/', { input: 'something' })
      .setHeader('Content-Type', 'application/x-amz-json-1.1')
      .setResponseBody({ output: 'anything' });

    const res = await httpClient.request({
      method: 'POST',
      data: '{"input": "something"}',
      responseType: 'json',
      headers: { 'Content-Type': 'application/x-amz-json-1.1' },
    });
    expect(res).toReplyWith({ status: STATUS_CODES.SUCCESS });

    expect(res.data).toStrictEqual({ output: 'anything' });
  });

  it('should support AWS json 1.1 content type and parse body', async () => {
    sb.post('/', { input: 'something' })
      .setHeader('Content-Type', 'application/x-amz-json-1.1')
      .setResponseBody({ output: 'anything' });

    const res = await httpClient.request({
      method: 'POST',
      data: '{"input": "something"}',
      responseType: 'json',
      headers: { 'Content-Type': 'application/x-amz-json-1.1' },
    });
    expect(res).toReplyWith({ status: STATUS_CODES.SUCCESS });

    expect(res.data).toStrictEqual({ output: 'anything' });
  });
});
