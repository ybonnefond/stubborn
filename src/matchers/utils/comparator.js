'use strict';

const { isEqualWith: isEqual } = require('lodash');

module.exports = {
    match: (def, value) => {
        return isEqual(def, value, customizer);
    }
};

function customizer(def, value) { // eslint-disable-line consistent-return
    if (def instanceof RegExp) {
        return def.test(value);
    }

    if ('function' === typeof def) {
        return def(value);
    }
}

