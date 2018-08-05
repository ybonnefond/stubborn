'use strict';

const { KeyMap, comparator: { match } } = require('./utils');

class QueryMatcher {
    constructor(route) {
        this.route = route;
    }

    match(req) {
        if (null === this.route.query) {
            return true;
        }

        const def = formatDef(this.route.query);

        const { query: rawQuery } = req;
        const formatedQuery = formatDef(rawQuery);

        const keyMap = new KeyMap(def);
        const query = keyMap.filterExcluded(formatedQuery);

        function compare(defValues, reqValues) {
            if (!Array.isArray(reqValues)) {
                return false;
            }

            return reqValues.every((reqValue) => {
                return defValues.some((defValue) => {
                    return match(defValue, reqValue);
                });
            });
        }

        return keyMap.compareIncluded(query, compare);
    }
}

function formatDef(rawDef) {
    return Object
        .keys(rawDef)
        .reduce((def, key) => {
            const rawValue = rawDef[key];
            const value = null === rawValue || Array.isArray(rawValue) ? rawValue : [rawValue];
            def[key] = value;
            return def;
        }, {});
}

module.exports = QueryMatcher;
