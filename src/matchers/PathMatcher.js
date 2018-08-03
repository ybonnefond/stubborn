'use strict';

const { comparator: { match } } = require('./utils');

class PathMatcher {
    constructor(route) {
        this.route = null;
        this.setRoute(route);
    }

    setRoute(route) {
        this.route = route;

        return this;
    }

    match(req) {
        const { path } = req;
        return match(this.route.path, path);
    }
}

module.exports = PathMatcher;
