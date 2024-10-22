import { STATUS_CODES, Request } from '../../src';
import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('Response', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should respond with NOT_IMPLEMENTED status code and request information', async () => {
    const data = () => ({ key: 'value' });
    const headers = () => ({
      'x-api-key': 'API_KEY',
    });

    expect(
      await httpClient.request({
        method: 'POST',
        query: { page: '10', limit: '100' },
        headers: headers(),
        data: data(),
      }),
    ).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
      message: expect.any(String),
      request: {
        method: 'POST',
        path: '/',
        headers: expect.objectContaining(headers()),
        query: { page: '10', limit: '100' },
        body: data(),
        hash: expect.any(String),
      },
    });
  });

  it('should respond with provided status code', async () => {
    const STATUS_CODE = 201;
    sb.get('/').setResponseStatusCode(STATUS_CODE);

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODE,
    });
  });

  it('should respond with provided headers', async () => {
    sb.get('/').setResponseHeaders({ custom: 'header' });

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: '',
      headers: expect.objectContaining({ custom: 'header' }),
    });
  });

  it('should respond with provided header', async () => {
    sb.get('/').setResponseHeader('custom', 'header');

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: '',
      headers: expect.objectContaining({ custom: 'header' }),
    });
  });

  it('should respond with a json encoded body if accept header is json', async () => {
    sb.get('/').setResponseBody('toto');

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: 'toto',
    });
  });

  it('should encode JSON is response content-type header is provided', async () => {
    sb.get('/')
      .setResponseBody('toto')
      .setResponseHeader('Content-Type', 'application/json; charset=utf-8');

    expect(await httpClient.request({ responseType: 'text' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: JSON.stringify('toto'),
    });
  });

  it('should respond with no encoding if accept and content-type is not provided', async () => {
    sb.get('/').setResponseBody('toto');

    expect(await httpClient.request({ responseType: 'text' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: '"toto"',
    });
  });

  it('should respond with provided object body', async () => {
    sb.get('/').setResponseBody({ custom: 'body' });

    expect(await httpClient.request({ responseType: 'json' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: {
        custom: 'body',
      },
    });
  });

  it('should respond with provided buffer body', async () => {
    sb.get('/').setResponseBody(Buffer.from('Hello buffer', 'utf-8'));

    const response = await httpClient.request({
      responseType: 'text',
      headers: {
        accept: 'text/plain',
      },
    });

    expect(response).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: 'Hello buffer',
    });
  });

  it('should respond with dynamic body', async () => {
    sb.get('/')
      .setQueryParameters({ page: '10' })
      .setResponseBody({
        custom: (req: Request) => req.query.page,
        arr: ['1', '2', () => '3', { one: () => 'un' }],
        sym: Symbol('bol'),
      } as any);

    expect(await httpClient.request({ query: { page: '10' } })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: {
        custom: '10',
        arr: ['1', '2', '3', { one: 'un' }],
        sym: 'bol',
      },
    });
  });

  it('should pass the current scope for deep object template', async () => {
    sb.get('/')
      .setQueryParameters({ page: '22' })
      .setResponseBody({
        custom: {
          val1: 'some value',
          val2: (req: Request, scope: any) =>
            `${scope.val1} - page: ${req.query.page}`,
        },
      });

    expect(
      await httpClient.request({
        query: { page: '22' },
      }),
    ).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      body: {
        custom: {
          val1: 'some value',
          val2: 'some value - page: 22',
        },
      },
    });
  });

  it('should return a null value in response body', async () => {
    sb.post('/').setResponseBody({ key: 'ok', nullValue: null });

    const res = await httpClient.request({
      method: 'POST',
    });
    expect(res).toReplyWith({ status: STATUS_CODES.SUCCESS });

    expect(res.data).toStrictEqual({ key: 'ok', nullValue: null });
  });

  it('should not return undefined values in response body', async () => {
    sb.post('/').setResponseBody({ key: 'ok', undefinedValue: undefined });

    const res = await httpClient.request({
      method: 'POST',
    });
    expect(res).toReplyWith({ status: STATUS_CODES.SUCCESS });

    expect(res.data).toStrictEqual({
      key: 'ok',
    });
  });

  it('should transform as a JSON.stringify would do undefined values within arrays', async () => {
    sb.post('/').setResponseBody({
      key: 'ok',
      undefinedValue: undefined,
      arrayValue: [undefined, { something: 'else' }],
    } as any);

    const res = await httpClient.request({
      method: 'POST',
    });
    expect(res).toReplyWith({ status: STATUS_CODES.SUCCESS });

    expect(res.data).toStrictEqual({
      key: 'ok',
      arrayValue: [null, { something: 'else' }],
    });
  });

  it('should not set a response if no response is provided and not json', async () => {
    const STATUS_CODE = 200;
    sb.delete('/').setResponseStatusCode(STATUS_CODE);

    expect(
      await httpClient.request({
        method: 'DELETE',
        responseType: 'text',
      }),
    ).toReplyWith({ status: STATUS_CODE });
  });
});
