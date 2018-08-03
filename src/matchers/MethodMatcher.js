'use strict';

const { comparator: { match } } = require('./utils');

class MethodMatcher {
    constructor(route) {
        this.route = null;
        this.setRoute(route);
    }

    setRoute(route) {
        this.route = route;

        return this;
    }

    match(req) {
        const { method } = req;
        return match(this.route.method, method);
    }
}

module.exports = MethodMatcher;
