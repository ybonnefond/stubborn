import { WILDCARD } from '../../src';

import { STATUS_CODES } from '../../src';
import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('Request matching Query', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should return NOT_IMPLEMENTED if query parameters is not in definition', async () => {
    sb.get('/');

    expect(
      await httpClient.request({
        query: { page: '10' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return NOT_IMPLEMENTED if query parameter in definition is not provided', async () => {
    sb.get('/').setQueryParameters({ page: 10 });

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
  });

  it('should return NOT_IMPLEMENTED if query parameters are different', async () => {
    sb.get('/').setQueryParameters({ page: 10 });

    expect(
      await httpClient.request({
        query: { limit: '5' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return NOT_IMPLEMENTED if query parameter value is not strictly equal to definition', async () => {
    sb.get('/').setQueryParameters({ page: 10 });

    expect(
      await httpClient.request({
        query: { page: '11' },
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return SUCCESS if query parameter is strictly equal to the definition', async () => {
    sb.get('/').setQueryParameters({ page: '10' });

    expect(
      await httpClient.request({
        query: { page: '10' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if query parameters are wildcarded', async () => {
    sb.get('/').setQueryParameters(WILDCARD);

    expect(
      await httpClient.request({
        query: { page: '10' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if query parameter is WILDCARD and in query', async () => {
    sb.get('/').setQueryParameters({ page: WILDCARD });

    expect(
      await httpClient.request({
        query: { page: '10' },
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if query parameter is WILDCARD and not in query', async () => {
    sb.get('/').setQueryParameters({ page: WILDCARD });

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if query parameter matches multiple values', async () => {
    sb.get('/').setQueryParameters({ image: ['id1', 'id2'] });

    expect(
      await httpClient.request({
        query: new URLSearchParams('image=id1&image=id2'),
      }),
    ).toReplyWith({ status: STATUS_CODES.SUCCESS });
  });

  it('should return SUCCESS if query parameter does not match multiple values', async () => {
    sb.get('/').setQueryParameters({ image: ['id1', 'id2'] });

    expect(
      await httpClient.request({
        query: new URLSearchParams('image=id1&image=id3'),
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  it('should return NOT_IMPLEMENTED if header does not match the definition', async () => {
    sb.get('/').setQueryParameters({ page: /^\d+$/ });

    expect(await httpClient.request({ query: { page: 'two' } })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
  });

  it('should return SUCCESS if header match a regexp', async () => {
    sb.get('/').setQueryParameters({ page: /^\d+$/ });

    expect(await httpClient.request({ query: { page: '100' } })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS if header match a custom function', async () => {
    sb.get('/').setQueryParameters({ page: param => param === '100' });

    expect(await httpClient.request({ query: { page: '100' } })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });

  it('should return SUCCESS when setting a specific query parameter', async () => {
    sb.get('/').setQueryParameter('page', '100');

    expect(await httpClient.request({ query: { page: '100' } })).toReplyWith({
      status: STATUS_CODES.SUCCESS,
    });
  });
});
