import got from 'got';
import { STATUS_CODES, WILDCARD, Stubborn } from '../../src';

describe('README examples', () => {
  const sb = new Stubborn();

  beforeAll(async () => await sb.start());
  afterAll(async () => await sb.stop());
  afterEach(() => sb.clear());

  it('should respond to query', async () => {
    const body = { some: 'body' };
    sb.get('/').setResponseBody({ some: 'body' });

    const res = await request(`/`);

    expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
    expect(res.body).toEqual(body);
  });

  it('should respond 501 if a parameter is missing', async () => {
    sb.get('/').setQueryParameters({ page: '1' });

    const res = await request(`/`);

    expect(res.statusCode).toBe(STATUS_CODES.NOT_IMPLEMENTED);
  });

  it('should respond 501 if a parameter is added', async () => {
    sb.get('/').setQueryParameters({ page: '1' });

    const res = await request('/?page=1&limit=10');

    expect(res.statusCode).toBe(STATUS_CODES.NOT_IMPLEMENTED);
  });

  it('should respond 501 if a parameter is not equal', async () => {
    sb.get('/').setQueryParameters({ page: '1' });

    const res = await request('/?page=2');

    expect(res.statusCode).toBe(STATUS_CODES.NOT_IMPLEMENTED);
  });

  it('should respond using WILDCARD for parameter and headers', async () => {
    sb.get('/').setQueryParameters({ page: WILDCARD }).setHeaders(WILDCARD);

    const res = await request('/?page=2', {
      headers: { 'x-api-key': 'api key', 'any-other-header': 'stuff' },
    });

    expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
  });

  it('should match using regex', async () => {
    sb.post('/', {
      slug: /^[a-z\-]*$/,
    })
      .setQueryParameters({ page: /^\d$/ })
      .setHeaders(WILDCARD);

    const res = await request('/?page=2', {
      method: 'POST',
      json: { slug: 'stubborn-ws' },
    });

    expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
  });

  it('should match using a function', async () => {
    sb.get('/').setQueryParameters({
      page: value => parseInt(value as string, 10) > 0,
    });

    const res = await request('/?page=2');

    expect(res.statusCode).toBe(STATUS_CODES.SUCCESS);
  });

  function request(path = '/', options = {}) {
    return got(`${sb.getOrigin()}${path}`, {
      method: 'GET',
      responseType: 'json',
      throwHttpErrors: false,
      ...options,
    });
  }
});
