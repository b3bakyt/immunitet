'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processString = undefined;

var _exceptions = require('../exceptions');

var STRING_PROCESSORS = {
    'toUpperCase': function toUpperCase(value) {
        return ('' + value).toUpperCase();
    },

    'toLowerCase': function toLowerCase(value) {
        return ('' + value).toLowerCase();
    },

    'capitalFirst': function capitalFirst(value) {
        return ('' + value).replace(/^\w/g, function (l) {
            return l.toUpperCase();
        });
    },

    'capitalFirstLetter': function capitalFirstLetter(value) {
        return ('' + value).replace(/\b\w/g, function (l) {
            return l.toUpperCase();
        });
    }
};

var processString = exports.processString = function processString(value, processors) {
    var processorsList = processors.split(',');

    if (processorsList.length === 0) return value;

    processorsList.map(function (processor) {
        if (!STRING_PROCESSORS[processor]) throw new _exceptions.ImmunitetException('Wrong keyword given as an argument for String type processor.');

        value = STRING_PROCESSORS[processor].call(null, value);
    });

    return value;
};