'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processBoolean = undefined;

var _exceptions = require('../exceptions');

var BOOLEAN_PROCESSORS = {
    'convert': function convert(value) {
        if (value === 'true') return true;

        if (value === 'false') return false;

        return Boolean(value);
    }
};

var processBoolean = exports.processBoolean = function processBoolean(value, processors) {
    var processorsList = processors.split(',');

    if (processorsList.length === 0) return value;

    processorsList.map(function (processor) {
        if (!BOOLEAN_PROCESSORS[processor]) throw new _exceptions.ImmunitetException('Wrong keyword given as an argument for Boolean type processor.');

        value = BOOLEAN_PROCESSORS[processor].call(null, value);
    });

    return value;
};