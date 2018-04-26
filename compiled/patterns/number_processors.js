'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processNumber = undefined;

var _exceptions = require('../exceptions');

var NUMBER_PROCESSORS = {
    'convert': function convert(value) {
        return Number(value);
    },

    'floor': function floor(value) {
        return Math.floor(value);
    },

    'round': function round(value) {
        return Math.round(value);
    },

    'ceil': function ceil(value) {
        return Math.ceil(value);
    }
};

var processNumber = exports.processNumber = function processNumber(value, processors, argNumber) {
    var processorsList = processors.split(',');

    if (processorsList.length === 0) return value;

    processorsList.map(function (processor) {
        if (!NUMBER_PROCESSORS[processor]) throw new _exceptions.ImmunitetException('Wrong keyword given as an argument for Number type processor.', argNumber);

        value = NUMBER_PROCESSORS[processor].call(null, value);
    });

    return value;
};