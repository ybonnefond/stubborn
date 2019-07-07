import { Server } from 'http';
import { AddressInfo } from 'net';

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
