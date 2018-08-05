'use strict';

const { KeyMap, comparator: { match } } = require('./utils');

class HeaderMatcher {
    constructor(route) {
        this.route = route;
    }

    match(req) {
        if (null === this.route.headers) {
            return true;
        }

        const def = this.route.headers;
        const { headers: rawHeaders } = req;
        const keyMap = new KeyMap(def, { caseSensitive: false });

        // Filter headers where def has null for value
        const headers = keyMap.filterExcluded(rawHeaders);

        function compare(defValue, reqValue) {
            if ('string' !== typeof reqValue) {
                return false;
            }

            return match(defValue, reqValue);
        }

        return keyMap.compareIncluded(headers, compare);
    }
}

module.exports = HeaderMatcher;
