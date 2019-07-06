"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getServerPort(server) {
    const address = server.address();
    if (null !== address) {
        return address.port;
    }
    return null;
}
exports.getServerPort = getServerPort;
//# sourceMappingURL=utils.js.map