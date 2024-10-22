import { STATUS_CODES } from '../../src';

import { toReplyWith } from '../matchers';
import { test } from '../test';

expect.extend({ toReplyWith });
const sb = test.getStubbornInstance();
const httpClient = test.getHttpClient();
describe('Request matching Method', () => {
  it('should return NOT_IMPLEMENTED if method does not match', async () => {
    sb.get('/');

    expect(await httpClient.request({ method: 'POST' })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
  });

  it('should return SUCCESS if method is GET', async () => {
    sb.get('/');

    expect(
      await httpClient.request({
        method: 'GET',
        path: '/',
      }),
    ).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if method is HEAD', async () => {
    sb.head('/');

    expect(
      await httpClient.request({
        method: 'HEAD',
        path: '/',
      }),
    ).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if method is OPTIONS', async () => {
    sb.options('/');

    expect(
      await httpClient.request({
        method: 'OPTIONS',
        path: '/',
      }),
    ).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if method is POST', async () => {
    sb.post('/');

    expect(await httpClient.request({ method: 'POST' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if method is POST with string body', async () => {
    sb.post('/', 'body');

    expect(
      await httpClient.request({
        method: 'POST',
        data: 'body',
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if method is PUT', async () => {
    sb.put('/');

    expect(await httpClient.request({ method: 'PUT' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if method is PUT with string body', async () => {
    sb.put('/', 'body');

    expect(
      await httpClient.request({ method: 'PUT', data: 'body' }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if method is PATCH', async () => {
    sb.patch('/');

    expect(await httpClient.request({ method: 'PATCH' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if method is PATCH with string body', async () => {
    sb.patch('/', 'body');

    expect(
      await httpClient.request({ method: 'PATCH', data: 'body' }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if method is DELETE', async () => {
    sb.delete('/');

    expect(await httpClient.request({ method: 'DELETE' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });
});
