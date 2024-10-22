import { Readable } from 'stream';
import FormData from 'form-data';
import { JsonValue, MatchFunction } from '../../src';

import { STATUS_CODES } from '../../src';
import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('Request matching Body', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should return NOT_IMPLEMENTED if body is not in definition', async () => {
    sb.post('/');

    expect(
      await httpClient.request({
        method: 'POST',
        data: 'test',
        responseType: 'text',
      }),
    ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
  });

  describe('Text body', () => {
    it('should return NOT_IMPLEMENTED if no body in request but in definition', async () => {
      sb.post('/', 'test').setHeaders({ 'Content-Type': 'text/plain' });

      expect(
        await httpClient.request({
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
        }),
      ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
    });

    it('should return NOT_IMPLEMENTED if body in request but not in definition', async () => {
      sb.post('/').setHeaders({ 'Content-Type': 'text/plain' });

      expect(
        await httpClient.request({
          method: 'POST',
          data: 'test',
          headers: { 'Content-Type': 'text/plain' },
        }),
      ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
    });

    it('should return SUCCESS if definition is strictly equal to body', async () => {
      sb.post('/', 'test').setHeaders({ 'Content-Type': 'text/plain' });

      expect(
        await httpClient.request({
          method: 'POST',
          data: 'test',
          headers: { 'Content-Type': 'text/plain' },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });

    it('should return NOT_IMPLEMENTED if string body does not equal definition body', async () => {
      sb.post('/', 'test').setHeaders({ 'Content-Type': 'text/plain' });

      expect(
        await httpClient.request({
          method: 'POST',
          data: 'test2',
          headers: { 'Content-Type': 'text/plain' },
        }),
      ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
    });
  });

  describe('Object body', () => {
    it('should return SUCCESS if json body is equal to definition', async () => {
      sb.post('/', { key: 'value' }).setHeaders({
        'Content-Type': 'application/json',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { key: 'value' },
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });

    it('should return NOT_IMPLEMENTED if values are different in object body', async () => {
      sb.post('/', { key: 'value2' }).setHeaders({
        'Content-Type': 'application/json',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { key: 'value' },
        }),
      ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
    });

    it('should return NOT_IMPLEMENTED if keys are different in object body', async () => {
      sb.post('/', { key2: 'value' }).setHeaders({
        'Content-Type': 'application/json',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { key: 'value' },
        }),
      ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
    });

    it('should return NOT_IMPLEMENTED if count keys are different in object definition', async () => {
      sb.post('/', { key: 'value', key2: 'value' }).setHeaders({
        'Content-Type': 'application/json',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { key: 'value' },
        }),
      ).toReplyWith({ status: STATUS_CODES.NOT_IMPLEMENTED });
    });

    it('should return SUCCESS if json body is equal to definition with complex object', async () => {
      sb.post('/', {
        subObject: { subArray: [{ key: 'value' }] },
      }).setHeaders({ 'Content-Type': 'application/json' });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { subObject: { subArray: [{ key: 'value' }] } },
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });

    it('should return SUCCESS if body equals definition with regex', async () => {
      sb.post('/', { key: /\d+/, key2: [{ subkey: /\d+/ }] }).setHeaders({
        'Content-Type': 'application/json',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { key: 11, key2: [{ subkey: 13 }] },
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });

    it('should return SUCCESS if body equals definition with custom function', async () => {
      const key: MatchFunction = (val: JsonValue) => val === 'test';
      const subkey: MatchFunction = (val: JsonValue) => val === 'toto';

      sb.post('/', {
        key,
        key2: [{ subkey }],
      }).setHeaders({ 'Content-Type': 'application/json' });

      expect(
        await httpClient.request({
          method: 'POST',
          data: { key: 'test', key2: [{ subkey: 'toto' }] },
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });
  });

  describe('multipart/form-data', () => {
    it('should return SUCCESS with a form field', async () => {
      const form = new FormData();
      form.append('field1', 'value1');

      sb.post('/', { field1: 'value1' }).setHeaders({
        ...form.getHeaders(),
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: form,
          headers: { ...form.getHeaders() },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });

    it('should return SUCCESS with a form field with stream', async () => {
      const form = new FormData();
      form.append('stream1', Readable.from(Buffer.from('Hello')));

      sb.post('/', { stream1: 'Hello' }).setHeaders({
        ...form.getHeaders(),
        'transfer-encoding': 'chunked',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: form,
          headers: { ...form.getHeaders() },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });

    it('should return SUCCESS with a form field with streamed file', async () => {
      const form = new FormData();
      form.append('file', Readable.from(Buffer.from('Hello')), {
        filename: 'file.txt',
      });

      sb.post('/', {
        file: {
          filename: 'file.txt',
          content: 'Hello',
        },
      }).setHeaders({
        ...form.getHeaders(),
        'transfer-encoding': 'chunked',
      });

      expect(
        await httpClient.request({
          method: 'POST',
          data: form,
          headers: { ...form.getHeaders() },
        }),
      ).toReplyWith({ status: STATUS_CODES.SUCCESS });
    });
  });
});
