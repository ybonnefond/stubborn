'use strict';

const matchers = require('./matchers');

class RouteMatcher {
    constructor(route) {
        this.route = route;
        this.matchers = [];

        initMatchers(this);
    }

    match(req) {
        return this.matchers.every(matcher => {
            return matcher.match(req);
        });
    }
}

function initMatchers(matcher) {
    matcher.matchers = Object
        .values(matchers)
        .map((MatcherClass) => {
            return new MatcherClass(matcher.route);
        });
}

module.exports = RouteMatcher;
