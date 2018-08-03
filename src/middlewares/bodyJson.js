'use strict';

const { json } = require('body-parser');

module.exports = (options = {}) => {
    return json(options);
};
