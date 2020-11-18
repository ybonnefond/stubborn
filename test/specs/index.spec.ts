import {
  EVENTS,
  JsonValue,
  logDiffOn501,
  MatchFunction,
  METHODS,
  Route,
  WILDCARD,
} from '../../src';

import { Request } from '../../src/@types';
import { STATUS_CODES } from '../../src/constants';
import { Debugger } from '../../src/debug/Debugger';
import { init, stripAnsi } from '../helpers';
import { toReplyWith } from '../matchers';

describe('index', () => {
  expect.extend({ toReplyWith });
  const { sb, request } = init();

  it('should return NOT_IMPLEMENTED if no routes are configured', async () => {
    const mockFn = jest.fn();
    sb.on(EVENTS.NOT_IMPLEMENTED, mockFn);

    expect(await request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
    expect(mockFn).toHaveBeenCalledTimes(1);
    const [dbg]: [Debugger] = mockFn.mock.calls[0];
    const req = dbg.getInfo();
    expect(req.method).toBe('GET');
    expect(req.path).toBe('/');
    expect(req.headers).toEqual({
      accept: 'application/json',
      'accept-encoding': expect.any(String),
      connection: 'close',
      host: expect.any(String),
      'user-agent': expect.any(String),
    });
    expect(req.query).toEqual({});
    expect(req.body).toBeUndefined();
    expect(req.hash).toBe('');
  });

  describe('Request matching', () => {
    describe('Method', () => {
      it('should return NOT_IMPLEMENTED if method does not match', async () => {
        sb.get('/');

        expect(await request('/', { method: 'POST' })).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return SUCCESS if method is GET', async () => {
        sb.get('/');

        expect(await request('/')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if method is POST', async () => {
        sb.post('/');

        expect(await request('/', { method: 'POST' })).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });

      it('should return SUCCESS if method is POST with empty body', async () => {
        sb.post('/', '');

        expect(await request('/', { method: 'POST', body: '' })).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });

      it('should return SUCCESS if method is POST with string body', async () => {
        sb.post('/', 'body');

        expect(
          await request('/', { method: 'POST', body: 'body' }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if method is PUT', async () => {
        sb.put('/');

        expect(await request('/', { method: 'PUT' })).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });

      it('should return SUCCESS if method is PUT with string body', async () => {
        sb.put('/', 'body');

        expect(await request('/', { method: 'PUT', body: 'body' })).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });

      it('should return SUCCESS if method is PATCH', async () => {
        sb.patch('/');

        expect(await request('/', { method: 'PATCH' })).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });

      it('should return SUCCESS if method is PATCH with string body', async () => {
        sb.patch('/', 'body');

        expect(
          await request('/', { method: 'PATCH', body: 'body' }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if method is DELETE', async () => {
        sb.delete('/');

        expect(await request('/', { method: 'DELETE' })).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });
    });

    describe('Path', () => {
      it('should return NOT_IMPLEMENTED if path does not strictly match', async () => {
        sb.get('/test');

        expect(await request('/test2')).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return SUCCESS if path strictly match', async () => {
        sb.get('/test');

        expect(await request('/test')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return NOT_IMPLEMENTED if path does not match a regex', async () => {
        sb.get(/\/test\/[0-9]{1}/);

        expect(await request('/test2', { method: 'GET' })).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return SUCCESS if path match regexp', async () => {
        sb.get(/\/test\/[0-9]{1}/);

        expect(await request('/test/2')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if path match custom function', async () => {
        sb.get(path => path === '/test/2');

        expect(await request('/test/2')).toReplyWith(STATUS_CODES.SUCCESS);
      });
    });

    describe('Headers', () => {
      it('should return SUCCESS if headers are wildcarded', async () => {
        sb.get('/').setHeaders(WILDCARD);

        expect(
          await request('/', { headers: { Authorization: 'token' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return NOT_IMPLEMENTED if header is not in definition', async () => {
        sb.get('/');

        expect(
          await request('/', { headers: { Authorization: 'token' } }),
        ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      it('should return NOT_IMPLEMENTED if header in definition is not provided', async () => {
        sb.get('/').setHeaders({ Authorization: 'token' });

        expect(await request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      it('should return NOT_IMPLEMENTED if headers name are different', async () => {
        sb.get('/').setHeaders({ Authorization: 'token' });

        expect(
          await request('/', { headers: { 'x-api-key': 'api-key' } }),
        ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      it('should return NOT_IMPLEMENTED if headers values are different', async () => {
        sb.get('/').setHeaders({ Authorization: 'token' });

        expect(
          await request('/', { headers: { Authorization: 'not-token' } }),
        ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      it('should return SUCCESS if header is WILDCARD and in request', async () => {
        sb.get('/').setHeaders({ Authorization: WILDCARD });

        expect(
          await request('/', { headers: { Authorization: 'token' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if header is WILDCARD and not in request', async () => {
        sb.get('/').setHeaders({ Authorization: WILDCARD });

        expect(await request('/')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if header is strictly equal to the definition', async () => {
        sb.get('/').setHeaders({ Authorization: 'token' });

        expect(
          await request('/', { headers: { Authorization: 'token' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if header is strictly equal to the definition and case is different', async () => {
        sb.get('/').setHeaders({ Authorization: 'token' });

        expect(
          await request('/', { headers: { AUTHORIZATION: 'token' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return NOT_IMPLEMENTED if header does not match the definition', async () => {
        sb.get('/').setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

        expect(
          await request('/', { headers: { Authorization: 'Bearer 11' } }),
        ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      it('should return SUCCESS if header match a regexp', async () => {
        sb.get('/').setHeaders({ Authorization: /^Bearer [0-9]{1}$/ });

        expect(
          await request('/', { headers: { Authorization: 'Bearer 9' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if header match a custom function', async () => {
        sb.get('/').setHeaders({
          Authorization: header => header === 'Bearer 9',
        });

        expect(
          await request('/', { headers: { Authorization: 'Bearer 9' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS when setting a specific header', async () => {
        sb.get('/').setHeader('Authorization', 'Bearer 9');

        expect(
          await request('/', { headers: { Authorization: 'Bearer 9' } }),
        ).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should convert json if JSON Accept header', async () => {
        sb.post('/', '{"key": "value"}').setResponseBody({ key: 'ok' });

        const res = await request('/', {
          method: 'post',
          body: '{"key": "value"}',
          responseType: 'text',
          headers: { Accept: 'application/vnd.api+json' },
        });
        expect(res).toReplyWith(STATUS_CODES.SUCCESS);

        const body = JSON.parse(res.body as string);
        expect(body).toStrictEqual({ key: 'ok' });
      });
    });

    describe('Query', () => {
      it('should return NOT_IMPLEMENTED if query parameters is not in definition', async () => {
        sb.get('/');

        expect(await request('/?page=10')).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return NOT_IMPLEMENTED if query parameter in definition is not provided', async () => {
        sb.get('/').setQueryParameters({ page: 10 });

        expect(await request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      it('should return NOT_IMPLEMENTED if query parameters are different', async () => {
        sb.get('/').setQueryParameters({ page: 10 });

        expect(await request('/?limit=5')).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return NOT_IMPLEMENTED if query parameter value is not strictly equal to definition', async () => {
        sb.get('/').setQueryParameters({ page: 10 });

        expect(await request('/?page=11')).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return SUCCESS if query parameter is strictly equal to the definition', async () => {
        sb.get('/').setQueryParameters({ page: '10' });

        expect(await request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if query parameters are wildcarded', async () => {
        sb.get('/').setQueryParameters(WILDCARD);

        expect(await request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if query parameter is WILDCARD and in query', async () => {
        sb.get('/').setQueryParameters({ page: WILDCARD });

        expect(await request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if query parameter is WILDCARD and not in query', async () => {
        sb.get('/').setQueryParameters({ page: WILDCARD });

        expect(await request('/')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if query parameter matches multiple values', async () => {
        sb.get('/').setQueryParameters({ image: ['id1', 'id2'] });

        expect(await request('/?image=id1&image=id2')).toReplyWith(
          STATUS_CODES.SUCCESS,
        );
      });

      it('should return SUCCESS if query parameter does not match multiple values', async () => {
        sb.get('/').setQueryParameters({ image: ['id1', 'id2'] });

        expect(await request('/?image=id1&image=id3')).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return NOT_IMPLEMENTED if header does not match the definition', async () => {
        sb.get('/').setQueryParameters({ page: /^\d+$/ });

        expect(await request('/?page=two')).toReplyWith(
          STATUS_CODES.NOT_IMPLEMENTED,
        );
      });

      it('should return SUCCESS if header match a regexp', async () => {
        sb.get('/').setQueryParameters({ page: /^\d+$/ });

        expect(await request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS if header match a custom function', async () => {
        sb.get('/').setQueryParameters({ page: param => param === '100' });

        expect(await request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
      });

      it('should return SUCCESS when setting a specific query parameter', async () => {
        sb.get('/').setQueryParameter('page', '100');

        expect(await request('/?page=100')).toReplyWith(STATUS_CODES.SUCCESS);
      });
    });

    describe('Body', () => {
      it('should return NOT_IMPLEMENTED if body is not in definition', async () => {
        sb.post('/');

        expect(
          await request('/', {
            method: 'POST',
            body: 'test',
            responseType: 'text',
          }),
        ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
      });

      describe('Text body', () => {
        it('should return NOT_IMPLEMENTED if no body in request but in definition', async () => {
          sb.post('/', 'test').setHeaders({ 'Content-Type': 'text/plain' });

          expect(
            await request('/', {
              method: 'POST',
              json: false,
              headers: { 'Content-Type': 'text/plain' },
            }),
          ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should return NOT_IMPLEMENTED if body in request but not in definition', async () => {
          sb.post('/').setHeaders({ 'Content-Type': 'text/plain' });

          expect(
            await request('/', {
              method: 'POST',
              body: 'test',
              headers: { 'Content-Type': 'text/plain' },
            }),
          ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should return SUCCESS if definition is strictly equal to body', async () => {
          sb.post('/', 'test').setHeaders({ 'Content-Type': 'text/plain' });

          expect(
            await request('/', {
              method: 'POST',
              body: 'test',
              headers: { 'Content-Type': 'text/plain' },
            }),
          ).toReplyWith(STATUS_CODES.SUCCESS);
        });

        it('should return NOT_IMPLEMENTED if string body does not equal definition body', async () => {
          sb.post('/', 'test').setHeaders({ 'Content-Type': 'text/plain' });

          expect(
            await request('/', {
              method: 'POST',
              body: 'test2',
              headers: { 'Content-Type': 'text/plain' },
            }),
          ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
        });
      });

      describe('Object body', () => {
        it('should return SUCCESS if json body is equal to definition', async () => {
          sb.post('/', { key: 'value' }).setHeaders({
            'Content-Type': 'application/json',
          });

          expect(
            await request('/', {
              method: 'POST',
              json: { key: 'value' },
            }),
          ).toReplyWith(STATUS_CODES.SUCCESS);
        });

        it('should return NOT_IMPLEMENTED if values are different in object body', async () => {
          sb.post('/', { key: 'value2' }).setHeaders({
            'Content-Type': 'application/json',
          });

          expect(
            await request('/', {
              method: 'POST',
              json: { key: 'value' },
            }),
          ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should return NOT_IMPLEMENTED if keys are different in object body', async () => {
          sb.post('/', { key2: 'value' }).setHeaders({
            'Content-Type': 'application/json',
          });

          expect(
            await request('/', {
              method: 'POST',
              json: { key: 'value' },
            }),
          ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should return NOT_IMPLEMENTED if count keys are different in object definition', async () => {
          sb.post('/', { key: 'value', key2: 'value' }).setHeaders({
            'Content-Type': 'application/json',
          });

          expect(
            await request('/', {
              method: 'POST',
              json: { key: 'value' },
            }),
          ).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
        });

        it('should return SUCCESS if json body is equal to definition with complex object', async () => {
          sb.post('/', {
            subObject: { subArray: [{ key: 'value' }] },
          }).setHeaders({ 'Content-Type': 'application/json' });

          expect(
            await request('/', {
              method: 'POST',
              json: { subObject: { subArray: [{ key: 'value' }] } },
            }),
          ).toReplyWith(STATUS_CODES.SUCCESS);
        });

        it('should return SUCCESS if body equals definition with regex', async () => {
          sb.post('/', { key: /\d+/, key2: [{ subkey: /\d+/ }] }).setHeaders({
            'Content-Type': 'application/json',
          });

          expect(
            await request('/', {
              method: 'POST',
              json: { key: 11, key2: [{ subkey: 13 }] },
            }),
          ).toReplyWith(STATUS_CODES.SUCCESS);
        });

        it('should return SUCCESS if body equals definition with custom function', async () => {
          const key: MatchFunction = (val: JsonValue) => val === 'test';
          const subkey: MatchFunction = (val: JsonValue) => val === 'toto';

          sb.post('/', {
            key,
            key2: [{ subkey }],
          }).setHeaders({ 'Content-Type': 'application/json' });

          expect(
            await request('/', {
              method: 'POST',
              json: { key: 'test', key2: [{ subkey: 'toto' }] },
            }),
          ).toReplyWith(STATUS_CODES.SUCCESS);
        });
      });
    });
  });

  describe('Response', () => {
    it('should respond with NOT_IMPLEMENTED status code and request information', async () => {
      const options = {
        method: 'POST',
        headers: {
          'x-api-key': 'API_KEY',
        },
        json: { key: 'value' },
      };
      expect(await request('/?page=10&limit=100', options)).toReplyWith(
        STATUS_CODES.NOT_IMPLEMENTED,
        {
          message: expect.any(String),
          request: {
            method: 'POST',
            path: '/',
            headers: expect.objectContaining(options.headers),
            query: { page: '10', limit: '100' },
            body: options.json,
            hash: expect.any(String),
          },
        },
      );
    });

    it('should respond with provided status code', async () => {
      const STATUS_CODE = 201;
      sb.get('/').setResponseStatusCode(STATUS_CODE);

      expect(await request('/')).toReplyWith(STATUS_CODE);
    });

    it('should respond with provided headers', async () => {
      sb.get('/').setResponseHeaders({ custom: 'header' });

      expect(await request('/')).toReplyWith(
        STATUS_CODES.SUCCESS,
        '',
        expect.objectContaining({ custom: 'header' }),
      );
    });

    it('should respond with provided header', async () => {
      sb.get('/').setResponseHeader('custom', 'header');

      expect(await request('/')).toReplyWith(
        STATUS_CODES.SUCCESS,
        '',
        expect.objectContaining({ custom: 'header' }),
      );
    });

    it('should respond with a json encoded body if accept header is json', async () => {
      sb.get('/').setResponseBody('toto');

      expect(await request('/')).toReplyWith(STATUS_CODES.SUCCESS, 'toto');
    });

    it('should encode JSON is response content-type header is provided', async () => {
      sb.get('/')
        .setResponseBody('toto')
        .setResponseHeader('Content-Type', 'application/json; charset=utf-8');

      expect(await request('/', { responseType: 'text' })).toReplyWith(
        STATUS_CODES.SUCCESS,
        JSON.stringify('toto'),
      );
    });

    it('should respond with no encodding if accept and content-type is not provided', async () => {
      sb.get('/').setResponseBody('toto');

      expect(await request('/', { responseType: 'text' })).toReplyWith(
        STATUS_CODES.SUCCESS,
        'toto',
      );
    });

    it('should respond with provided object body', async () => {
      sb.get('/').setResponseBody({ custom: 'body' });

      expect(
        await request('/', { responseType: 'json' }),
      ).toReplyWith(STATUS_CODES.SUCCESS, { custom: 'body' });
    });

    it('should respond with dynamic body', async () => {
      sb.get('/')
        .setQueryParameters({ page: '10' })
        .setResponseBody({
          custom: (req: Request) => req.query.page,
          arr: ['1', '2', () => '3', { one: () => 'un' }],
          sym: Symbol('bol'),
        } as any);

      expect(await request('/?page=10')).toReplyWith(STATUS_CODES.SUCCESS, {
        custom: '10',
        arr: ['1', '2', '3', { one: 'un' }],
        sym: 'bol',
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

      expect(await request('/?page=22')).toReplyWith(STATUS_CODES.SUCCESS, {
        custom: {
          val1: 'some value',
          val2: 'some value - page: 22',
        },
      });
    });

    it('should return a null value in response body', async () => {
      sb.post('/').setResponseBody({ key: 'ok', nullValue: null });

      const res = await request('/', {
        method: 'post',
      });
      expect(res).toReplyWith(STATUS_CODES.SUCCESS);

      expect(res.body).toStrictEqual({ key: 'ok', nullValue: null });
    });

    it('should not return undefined values in response body', async () => {
      sb.post('/').setResponseBody({ key: 'ok', undefinedValue: undefined });

      const res = await request('/', {
        method: 'post',
      });
      expect(res).toReplyWith(STATUS_CODES.SUCCESS);

      expect(res.body).toStrictEqual({
        key: 'ok',
      });
    });

    it('should transform as a JSON.stringify would do undefined values within arrays', async () => {
      sb.post('/').setResponseBody({
        key: 'ok',
        undefinedValue: undefined,
        arrayValue: [undefined, { something: 'else' }],
      } as any);

      const res = await request('/', {
        method: 'post',
      });
      expect(res).toReplyWith(STATUS_CODES.SUCCESS);

      expect(res.body).toStrictEqual({
        key: 'ok',
        arrayValue: [null, { something: 'else' }],
      });
    });
  });

  describe('Retain Calls', () => {
    it('should have no calls when initialize the route', () => {
      const route = sb.get('/');
      expect(route.countCalls()).toBe(0);
    });

    it('should retain every calls made to the route', async () => {
      const route = sb.get('/');

      const TOTAL_CALLS = 3;

      for (let i = 1; i <= TOTAL_CALLS; i++) {
        await request();
        expect(route.countCalls()).toBe(i);
      }
    });

    it('should retain a striped version of the request', async () => {
      const route = sb
        .post('/', WILDCARD)
        .setHeaders(WILDCARD)
        .setQueryParameters(WILDCARD);

      await request('/?page=100', { method: 'POST', json: { some: 'body' } });

      expect(route.countCalls()).toBe(1);
      expect(route.getCall(0)).toEqual({
        method: 'POST',
        query: { page: '100' },
        body: { some: 'body' },
        path: '/',
        hash: '',
        headers: {
          accept: 'application/json',
          'accept-encoding': expect.any(String),
          connection: expect.any(String),
          'content-length': expect.any(String),
          'content-type': expect.any(String),
          host: expect.any(String),
          'user-agent': expect.any(String),
        },
      });
    });
  });

  describe('addRoute', () => {
    it('should return SUCCESS if method is GET', async () => {
      sb.addRoute(new Route(METHODS.GET, '/'));

      expect(await request('/')).toReplyWith(STATUS_CODES.SUCCESS);
    });
  });

  describe('removeRoute', () => {
    it('should return SUCCESS if method is GET', async () => {
      const route = new Route(METHODS.GET, '/');
      sb.addRoute(route);

      expect(await request('/')).toReplyWith(STATUS_CODES.SUCCESS);

      sb.removeRoute(route);
      expect(await request('/')).toReplyWith(STATUS_CODES.NOT_IMPLEMENTED);
    });
  });

  describe('debug', () => {
    async function run(req: any) {
      const spy = jest.spyOn(global.console, 'log').mockReturnValue();

      await req;

      const [out] = spy.mock.calls[0];
      spy.mockRestore();

      return stripAnsi(out).trim();
    }

    it('should output method diff', async () => {
      const route = sb.put('/');
      const req = request('/', { method: 'POST' });

      logDiffOn501(sb, route);

      const out = await run(req);

      expect(out).toEqual(
        '## Request: POST /\n\n' +
          'Method\n' +
          '- Received: post\n' +
          '+ Expected: put',
      );
    });

    it('should output object', async () => {
      const route = sb
        .post(/test$/, {
          name: (val: JsonValue) => val === 'tonton',
        })
        .setHeader('x-api-key', '123');
      const req = request('/test-stuff');
      logDiffOn501(sb, route);

      const out = await run(req);
      expect(out).toMatchSnapshot();
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

      const req = request('/test?param1=ten&extraParam=10', {
        method: 'POST',
        headers: {
          'x-header-1': 'Bearer world',
          'x-header-extra': 'x-extra-header-123',
        },
        json: {
          firstname: 123,
          lastname: 'Donald',
          extraKey: 'extra key value',
          roles: 'writer',
          pets: [{ name: 'Schrödinger', type: 'dog' }],
        },
      });

      logDiffOn501(sb, route);

      const out = await run(req);

      expect(out).toMatchSnapshot();
    });

    it('should output method diff using logDiff on route', async () => {
      sb.put('/').logDiffOn501();
      const req = request('/', { method: 'POST' });

      const out = await run(req);

      expect(out).toEqual(
        '## Request: POST /\n\n' +
          'Method\n' +
          '- Received: post\n' +
          '+ Expected: put',
      );
    });
  });
});
