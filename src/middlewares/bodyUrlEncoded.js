'use strict';

const { urlencoded } = require('body-parser');

module.exports = (options = {}) => {
    return urlencoded(options);
};
