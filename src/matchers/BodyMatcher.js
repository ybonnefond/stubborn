'use strict';

const { comparator: { match } } = require('./utils');

class BodyMatcher {
    constructor(route) {
        this.route = null;
        this.setRoute(route);
    }

    setRoute(route) {
        this.route = route;

        return this;
    }

    match(req) {
        const { body: rawBody } = req;
        const body = rawBody instanceof Buffer ? String(rawBody) : rawBody;

        // Bypass body matching
        if (null === this.route.body) {
            return true;
        }

        return match(this.route.body, body);
    }
}

module.exports = BodyMatcher;
