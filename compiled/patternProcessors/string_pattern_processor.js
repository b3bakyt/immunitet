'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.applyStringProcessors = exports.processStringPatterns = exports.createStringPatternProcessor = exports.pluginPatternProcessors = exports.setAlias = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _processor_flags = require('../constants/processor_flags');

var _utils = require('../utils');

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var PATTERN_PROCESSOR_ALIASES = {};
var PATTERN_PROCESSORS = {};

var setAlias = exports.setAlias = function setAlias(newProcessorName, processors) {
    PATTERN_PROCESSOR_ALIASES[newProcessorName] = processors;
};

var pluginPatternProcessors = exports.pluginPatternProcessors = function pluginPatternProcessors(patternProcessors) {
    if (Array.isArray(patternProcessors) || (0, _utils.isEmpty)(patternProcessors)) throw new Error('The pattern processors object must not be empty! ' + JSON.stringify(patternProcessors));

    PATTERN_PROCESSORS = _extends({}, PATTERN_PROCESSORS, patternProcessors);
    return true;
};

var createStringPatternProcessor = exports.createStringPatternProcessor = function createStringPatternProcessor(patternProcessors, patternProcessorAliases) {
    PATTERN_PROCESSOR_ALIASES = _extends({}, PATTERN_PROCESSOR_ALIASES, patternProcessorAliases);
    PATTERN_PROCESSORS = _extends({}, PATTERN_PROCESSORS, patternProcessors);

    return processStringPatterns;
};

var processStringPatterns = exports.processStringPatterns = function processStringPatterns(argumentValue, processors, argNumber) {
    var processorsList = processors.split('|');
    return applyStringProcessors(argumentValue, processorsList, argNumber);
};

var applyStringProcessors = exports.applyStringProcessors = function applyStringProcessors(argumentValue, processorsList, argNumber) {
    return processorsList.reduce(function (result, processor) {
        if (PATTERN_PROCESSOR_ALIASES[processor]) {
            return applyStringProcessors(result, PATTERN_PROCESSOR_ALIASES[processor].split('|'), argNumber);
        }

        var _processor$split = processor.split(':'),
            _processor$split2 = _toArray(_processor$split),
            processorType = _processor$split2[0],
            params = _processor$split2.slice(1);

        if (!processorType) return result;

        if (!PATTERN_PROCESSORS[processorType]) throw new Error('Unknown argument processor "' + processorType + '"!');

        if (PATTERN_PROCESSORS[processorType] === _processor_flags.PATTERN_FLAGS.PASS) return result;

        if (typeof PATTERN_PROCESSORS[processorType] !== 'function') {
            return result;
        }

        return PATTERN_PROCESSORS[processorType].call(null, result, params.join(':'), argNumber);
    }, argumentValue);
};