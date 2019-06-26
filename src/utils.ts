import { Server } from 'http';
import { AddressInfo } from 'net';

export function getServerPort(server: Server) {
  const address = server.address() as AddressInfo;

  if (null !== address) {
    return address.port;
  }

  return null;
}
