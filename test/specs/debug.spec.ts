import { JsonValue, logDiffOn501 } from '../../src';

import { stripAnsi } from '../helpers';
import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('debug', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  async function run(req: any) {
    const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);

    await req;

    const [out] = spy.mock.calls[0];
    spy.mockRestore();

    return stripAnsi(String(out)).trim();
  }

  it('should output method diff', async () => {
    const route = sb.put('/');
    const req = httpClient.request({ method: 'POST' });

    logDiffOn501(sb, route);

    const out = await run(req);

    expoectOutputToBe(out, [
      '## Route: POST /',
      expect.stringMatching(/^\s\sat .+:\d+:\d+/),
      'Method',
      '- Received: post',
      '+ Expected: put',
    ]);
  });

  it('should output object', async () => {
    const route = sb
      .post(/test$/, {
        name: (val: JsonValue) => val === 'tonton',
      })
      .setHeader('x-api-key', '123');
    const req = httpClient.request({
      path: '/test-stuff',
    });
    logDiffOn501(sb, route);

    const out = await run(req);
    expoectOutputToBe(out, [
      '## Route: GET /test-stuff',
      expect.stringMatching(/^\s\sat .+:\d+:\d+/),
      'Method',
      '- Received: get',
      '+ Expected: post',
      'Path',
      '- Received: /test-stuff',
      '+ Expected: /test$/',
      'Headers',
      '+ x-api-key: 123',
      'Body',
      '- Received: undefined',
      "+ Expected: { name: (val) => val === 'tonton' }",
    ]);
  });

  it('should output various stuff', async () => {
    const route = sb
      .put('/', {
        firstname: /^[a-z]+$/,
        lastname: val => val === 'Doe',
        roles: ['writer', 'reviewer'],
        pets: [{ name: 'Schrödinger', type: 'cat' }],
        missingKey: 'key missing',
      })
      .setQueryParameters({
        missingParam: /^[0-9]+$/,
        param1: /^[0-9]+$/,
      })
      .setHeader('x-header-missing', 'missing-header-123')
      .setHeader('x-header-1', 'Bearer hello')
      .setHeader('content-type', 'application/json');

    const req = httpClient.request({
      path: '/test',
      query: { param1: 'ten', extraParam: '10' },
      method: 'POST',
      headers: {
        'x-header-1': 'Bearer world',
        'x-header-extra': 'x-extra-header-123',
        'content-type': 'application/json',
      },
      data: {
        firstname: 123,
        lastname: 'Donald',
        extraKey: 'extra key value',
        roles: 'writer',
        pets: [{ name: 'Schrödinger', type: 'dog' }],
      },
    });

    logDiffOn501(sb, route);

    const out = await run(req);

    expoectOutputToBe(out, [
      '## Route: POST /test',
      expect.stringMatching(/^\s\sat .+:\d+:\d+/),
      'Method',
      '- Received: post',
      '+ Expected: put',
      'Path',
      '- Received: /test',
      '+ Expected: /',
      'Headers',
      '+   x-header-missing: missing-header-123',
      '-   x-header-extra: x-extra-header-123',
      '-   x-header-1: Bearer world',
      '+   x-header-1: Bearer hello',
      'Query',
      '+   missingParam: /^[0-9]+$/',
      '-   extraParam: 10',
      '-   param1: ten',
      '+   param1: /^[0-9]+$/',
      'Body',
      '+   missingKey: key missing',
      '-   extraKey: extra key value',
      '-   pets.0.type: dog',
      '+   pets.0.type: cat',
      '-   firstname: 123',
      '+   firstname: /^[a-z]+$/',
      '-   lastname: Donald',
      "+   lastname: val => val === 'Doe'",
      '-   roles: writer',
      "+   roles: [ 'writer', 'reviewer' ]",
    ]);
  });

  it('should output method diff using logDiff on route', async () => {
    sb.put('/').logDiffOn501();
    const req = httpClient.request({ method: 'POST' });

    const out = await run(req);

    expoectOutputToBe(out, [
      '## Route: POST /',
      expect.stringMatching(/^\s\sat .+:\d+:\d+/),
      'Method',
      '- Received: post',
      '+ Expected: put',
    ]);
  });

  function expoectOutputToBe(output: string, expected: string[]) {
    const lines = output.split('\n').filter(line => line !== '');
    expect(lines).toEqual(expect.arrayContaining(expected));
  }
});
