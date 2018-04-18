'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DEFAULT_VALUE_PROCESSORS = {
    'true': true,
    'false': false,
    'null': null
};

var processDefaultValue = exports.processDefaultValue = function processDefaultValue(value, defaultValue) {

    if (typeof DEFAULT_VALUE_PROCESSORS[defaultValue] !== 'undefined') defaultValue = DEFAULT_VALUE_PROCESSORS[defaultValue];

    return defaultValue;
};