import { STATUS_CODES } from '../../src';
import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('Request matching Path', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();
  it('should return NOT_IMPLEMENTED if path does not strictly match', async () => {
    sb.get('/test');

    expect(await httpClient.request({ path: '/test2' })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
  });

  it('should return SUCCESS if path strictly match', async () => {
    sb.get('/test');

    expect(await httpClient.request({ path: '/test' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return NOT_IMPLEMENTED if path does not match a regex', async () => {
    sb.get(/\/test\/[0-9]{1}/);

    expect(
      await httpClient.request({ path: '/test2', method: 'GET' }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return SUCCESS if path match regexp', async () => {
    sb.get(/\/test\/[0-9]{1}/);

    expect(await httpClient.request({ path: '/test/2' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if path match custom function', async () => {
    sb.get(path => path === '/test/2');

    expect(await httpClient.request({ path: '/test/2' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });
});
