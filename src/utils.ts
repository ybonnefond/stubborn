import { Server } from 'http';
import { AddressInfo } from 'net';
import { EVENTS } from './constants';
import { Debugger } from './debug/Debugger';
import { Route } from './Route';
import { Emitter } from './@types/Emitter';

/**
 * @internal
 * @param server
 * @return Server listening port or null if the server is not started
 */
export function getServerPort(server: Server) {
  const address = server.address() as AddressInfo;

  if (null !== address) {
    return address.port;
  }

  return null;
}

/**
 * @deprecated Use route.logDiff() instead
 *
 * LogDiff between an unmatched request and the given route
 *
 * @param emitter Stubborn instance
 * @param route Route
 */
export function logDiffOn501(emitter: Emitter, route: Route) {
  const handler = (dbg: Debugger) => {
    dbg.logDiff(route);
  };

  emitter.setMaxListeners(emitter.getMaxListeners() + 1);
  emitter.on(EVENTS.NOT_IMPLEMENTED, handler);
  emitter.once(EVENTS.CLEARED, () => {
    emitter.off(EVENTS.NOT_IMPLEMENTED, handler);
  });
}
