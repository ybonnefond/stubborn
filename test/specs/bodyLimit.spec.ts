import { Stubborn, STATUS_CODES, WILDCARD } from '../../src';
import { HttpClient } from '../helpers/httpClient';
import { toReplyWith } from '../matchers';

describe('Body limit', () => {
  expect.extend({ toReplyWith });

  // Just over body-parser's default 100kb limit
  const body = { data: 'a'.repeat(110 * 1024) };

  async function requestWith(sb: Stubborn) {
    await sb.start();
    try {
      sb.post('/', body).setHeaders(WILDCARD).setResponseBody({ ok: true });

      return await new HttpClient(sb).request({
        method: 'POST',
        data: body,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      await sb.stop();
    }
  }

  it('should refuse a body over 100kb by default', async () => {
    const res = await requestWith(new Stubborn());

    expect(res.status).toBe(413);
  });

  it('should accept a body over 100kb when bodyLimit is raised', async () => {
    const res = await requestWith(new Stubborn({ bodyLimit: '1mb' }));

    expect(res).toReplyWith({
      status: STATUS_CODES.SUCCESS,
      data: { ok: true },
    });
  });
});
