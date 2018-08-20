'use strict';

module.exports = {
    getServerPort(server) {
        const address = server.address();

        if (null !== address) {
            return address.port;
        }

        return null;
    }
};
