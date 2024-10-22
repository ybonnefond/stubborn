import { METHODS, Route } from '../../src';

import { STATUS_CODES } from '../../src';
import { toReplyWith } from '../matchers';
import { test } from '../test';
import { InvalidRemoveAfterMatchingTimesParameterError } from '../../src/errors/InvalidRemoveAfterMatchingTimesParameterError';

describe('Route management', () => {
  expect.extend({ toReplyWith });
  const sb = test.getStubbornInstance();
  const httpClient = test.getHttpClient();

  describe('addRoute', () => {
    it('should return SUCCESS if method is GET', async () => {
      sb.addRoute(new Route(METHODS.GET, '/'));

      expect(await httpClient.request({ path: '/' })).toReplyWith({
        status: STATUS_CODES.SUCCESS,
      });
    });
  });

  describe('removeRoute', () => {
    it('should return SUCCESS if method is GET', async () => {
      const route = new Route(METHODS.GET, '/');
      sb.addRoute(route);

      expect(await httpClient.request({ path: '/' })).toReplyWith({
        status: STATUS_CODES.SUCCESS,
      });

      sb.removeRoute(route);
      expect(await httpClient.request({ path: '/' })).toReplyWith({
        status: STATUS_CODES.NOT_IMPLEMENTED,
      });
    });

    describe('removeRouteAfterMatching', () => {
      describe('Given times is not a number', () => {
        it('should throw InvalidRemoveAfterMatchingTimesParameterError', () => {
          const route = new Route(METHODS.GET, '/');
          expect(() =>
            route.removeRouteAfterMatching({
              times: 'not a number' as unknown as number,
            }),
          ).toThrow(InvalidRemoveAfterMatchingTimesParameterError);
        });
      });

      describe.each([-15, -1, 0])('Given times is %s', times => {
        it('should throw InvalidRemoveAfterMatchingTimesParameterError', () => {
          const route = new Route(METHODS.GET, '/');
          expect(() =>
            route.removeRouteAfterMatching({
              times,
            }),
          ).toThrow(InvalidRemoveAfterMatchingTimesParameterError);
        });
      });

      describe('Given times is a valid value', () => {
        it('should return response until times is reached', async () => {
          const route = new Route(METHODS.GET, '/');
          route.removeRouteAfterMatching({ times: 2 });
          sb.addRoute(route);

          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.SUCCESS,
          });
          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.SUCCESS,
          });
          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.NOT_IMPLEMENTED,
          });
        });
      });

      describe('Given I want to change response after multiple calls', () => {
        it('should switch to next route after x calls', async () => {
          const TIMES = 3;

          sb.addRoute(
            new Route(METHODS.GET, '/')
              .setResponseStatusCode(STATUS_CODES.BAD_REQUEST)
              .removeRouteAfterMatching({ times: TIMES }),
          );

          sb.addRoute(
            new Route(METHODS.GET, '/').setResponseStatusCode(
              STATUS_CODES.SUCCESS,
            ),
          );

          for (let i = 0; i < TIMES; i++) {
            expect(await httpClient.request({ path: '/' })).toReplyWith({
              status: STATUS_CODES.BAD_REQUEST,
            });
          }

          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.SUCCESS,
          });
        });
      });

      describe('Given I want to change response after multiple calls and fallback to a default', () => {
        it('should switch to next route after x calls', async () => {
          [
            new Route(METHODS.GET, '/')
              .setResponseStatusCode(STATUS_CODES.BAD_REQUEST)
              .removeRouteAfterMatching({ times: 1 }),

            new Route(METHODS.GET, '/')
              .setResponseStatusCode(STATUS_CODES.NOT_FOUND)
              .removeRouteAfterMatching({ times: 1 }),

            new Route(METHODS.GET, '/').setResponseStatusCode(
              STATUS_CODES.SUCCESS,
            ),
          ].forEach(route => sb.addRoute(route));

          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.BAD_REQUEST,
          });

          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.NOT_FOUND,
          });

          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.SUCCESS,
          });

          expect(await httpClient.request({ path: '/' })).toReplyWith({
            status: STATUS_CODES.SUCCESS,
          });
        });
      });
    });
  });
});
