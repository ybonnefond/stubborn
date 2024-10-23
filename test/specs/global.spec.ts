import { EVENTS, METHODS, Route, STATUS_CODES } from '../../src';
import { Debugger } from '../../src/debug/Debugger';
import { toReplyWith } from '../matchers';
import { test } from '../test';

describe('index', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  it('should return NOT_IMPLEMENTED if no routes are configured', async () => {
    const mockFn = jest.fn();
    sb.on(EVENTS.NOT_IMPLEMENTED, mockFn);

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    const [dbg]: [Debugger] = mockFn.mock.calls[0];
    const req = dbg.getInfo();
    expect(req.method).toBe('GET');
    expect(req.path).toBe('/');
    expect(req.headers).toEqual({
      accept: 'application/json',
      'accept-encoding': expect.any(String),
      connection: expect.any(String),
      host: expect.any(String),
      'user-agent': expect.any(String),
    });
    expect(req.query).toEqual({});
    expect(req.body).toBeUndefined();
    expect(req.hash).toBe('');
  });

  describe('getInitializerPath', () => {
    describe('Given route is created from stubborn instance', () => {
      it('should return the path of the route', () => {
        const route = sb.get('/');

        const initializerPath = route.getInitializerPath();

        expect(initializerPath).toMatchObject({
          file: __filename,
          line: '38',
        });
      });
    });

    describe('Given route is created from class', () => {
      it('should return the path of the route', () => {
        class MyRoute extends Route {
          constructor() {
            super(METHODS.GET, '/');
          }
        }

        const route = new MyRoute();

        const initializerPath = sb.addRoute(route).getInitializerPath();

        expect(initializerPath).toMatchObject({
          file: __filename,
          line: '59',
        });
      });
    });
  });

  it('should return NOT_IMPLEMENTED if no routes are configured', async () => {
    const mockFn = jest.fn();
    sb.on(EVENTS.NOT_IMPLEMENTED, mockFn);

    expect(await httpClient.request({ path: '/' })).toReplyWith({
      status: STATUS_CODES.NOT_IMPLEMENTED,
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
    const [dbg]: [Debugger] = mockFn.mock.calls[0];
    const req = dbg.getInfo();
    expect(req.method).toBe('GET');
    expect(req.path).toBe('/');
    expect(req.headers).toEqual({
      accept: 'application/json',
      'accept-encoding': expect.any(String),
      connection: expect.any(String),
      host: expect.any(String),
      'user-agent': expect.any(String),
    });
    expect(req.query).toEqual({});
    expect(req.body).toBeUndefined();
    expect(req.hash).toBe('');
  });
});
