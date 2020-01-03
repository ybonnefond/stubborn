import { Server } from 'http';
import { AddressInfo } from 'net';
import { EVENTS } from './constants';
import { Debugger } from './debug/Debugger';
import { Route } from './Route';
import { Stubborn } from './Stubborn';

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

export function logDiffOn501(stubborn: Stubborn, route: Route) {
  const handler = (dbg: Debugger) => {
    dbg.logDiff(route);
  };

  stubborn.on(EVENTS.NOT_IMPLEMENTED, handler);
  stubborn.once(EVENTS.CLEARED, () => {
    stubborn.off(EVENTS.NOT_IMPLEMENTED, handler);
  });
}
