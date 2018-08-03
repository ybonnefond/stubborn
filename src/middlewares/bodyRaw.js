'use strict';

const { raw } = require('body-parser');

module.exports = (options = {}) => {
    return raw(options);
};
