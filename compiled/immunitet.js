'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _exceptions = require('./exceptions');

var _utils = require('./utils');

var _string_pattern_processor = require('./patternProcessors/string_pattern_processor');

var _function_pattern_processor = require('./patternProcessors/function_pattern_processor');

var _object_pattern_processor = require('./patternProcessors/object_pattern_processor');

var _string_patterns = require('./patterns/string_patterns');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ProcessorHandlers = {
    'string': (0, _string_pattern_processor.createStringPatternProcessor)(_string_patterns.PATTERN_PROCESSORS, _string_patterns.PATTERN_PROCESSOR_ALIASES),

    'function': _function_pattern_processor.processFunctionPatterns,

    'object': _object_pattern_processor.processObjectPatterns
};

var im = {
    validateFunction: function validateFunction(checkFn, processors) {
        var fn = checkFn;
        if (!fn) fn = function fn(val) {
            return val;
        };

        if (typeof fn !== 'function') throw new Error('First argument must be a type of function or null!');

        var arrayProcessors = (0, _utils.convertToArray)(processors);

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            try {
                return processArgumentsNRun(fn, args, arrayProcessors);
            } catch (exception) {
                // console.error('processedArgument.exception:', exception);
                if (exception instanceof _exceptions.ImmunitetException) return [null, exception];

                throw exception;
            }
        };
    },
    validateValue: function validateValue(processors) {
        if ((0, _utils.isEmpty)(processors)) throw new Error('Processor must be specified!');

        var fn = function fn() {
            for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                values[_key2] = arguments[_key2];
            }

            if (values.length <= 1) return values.pop();

            return values;
        };

        if (!processors) throw new Error('Argument must be specified!');

        var arrayProcessors = (0, _utils.convertToArray)(processors);

        return function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            try {
                return processArgumentsNRun(fn, args, arrayProcessors);
            } catch (exception) {
                if (exception instanceof _exceptions.ImmunitetException) return [null, exception];

                throw exception;
            }
        };
    },
    validatePromise: function validatePromise(checkFn, processors) {
        var fn = checkFn;
        if (!fn) fn = function fn(val) {
            return val;
        };

        if (typeof fn !== 'function') throw new Error('First argument must be a type of function or null!');

        var arrayProcessors = (0, _utils.convertToArray)(processors);

        return function () {
            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            try {
                if (!(0, _utils.hasPromiseValues)(args, arrayProcessors)) return processArgumentsNRun(fn, args, arrayProcessors);

                return runFunctionWithPromiseArguments(fn, args, arrayProcessors);
            } catch (exception) {
                if (exception instanceof _exceptions.ImmunitetException) return Promise.reject(exception);

                return Promise.reject(exception);
            }
        };
    }
};

var processArgumentsNRun = function processArgumentsNRun(fn, args, processors) {
    if ((0, _utils.isEmpty)(processors)) return runFunction(fn, args);

    var argArray = processArguments(args, processors);

    return runFunction(fn, argArray);
};

var runFunctionWithPromiseArguments = function runFunctionWithPromiseArguments(fn, args, processors) {
    var resolveValues = getPromiseValues(args);

    return resolveValues.then(function (resolvedArguments) {
        return processArgumentsNRun(fn, resolvedArguments, processors);
    }).catch(function (error) {
        console.error('processArgumentsNRun.error:', error);
        return Promise.reject(error);
    });
};

var runFunction = function runFunction(fn, argArray) {
    var functionResult = fn.apply(null, argArray);

    if (!(0, _utils.isPromise)(functionResult)) return [functionResult, null];

    function successHandler(result) {
        return result;
    }

    function catchHandler(error) {
        return Promise.reject(error);
    }

    return functionResult.then(successHandler).catch(catchHandler);
};

var processArguments = function processArguments(args, argumentsProcessors) {
    var processedArguments = [];

    for (var i = 0; i < argumentsProcessors.length; i++) {
        var processors = argumentsProcessors[i];
        if (!processors) continue;

        var argumentValue = args.shift();

        var processorsType = typeof processors === 'undefined' ? 'undefined' : _typeof(processors);
        if (!ProcessorHandlers[processorsType]) throw new Error('Unknown argument processor "' + processorsType + '"');

        var processedArgument = ProcessorHandlers[processorsType].call(null, argumentValue, processors);
        processedArguments.push(processedArgument);
    }

    return [].concat(processedArguments, _toConsumableArray(args));
};

var getPromiseValues = function getPromiseValues(values) {
    var promises = valuesToPromises(values);

    function successHandler(result) {
        return result;
    }

    function catchHandler(error) {
        return error;
    }

    var reflect = function reflect(promise) {
        return promise.then(successHandler).catch(catchHandler);
    };

    return Promise.all(promises.map(reflect));
};

var valuesToPromises = function valuesToPromises(values) {
    if ((0, _utils.isEmpty)(values)) return values;

    return values.map(function (value) {
        if ((0, _utils.isPromise)(value)) return value;

        return Promise.resolve(value);
    });
};

module.exports = _extends({}, im, {
    setAlias: _string_pattern_processor.setAlias,
    ImmunitetException: _exceptions.ImmunitetException,
    isPromise: _utils.isPromise,
    hasPromiseValues: _utils.hasPromiseValues,
    valuesToPromises: valuesToPromises,
    getPromiseValues: getPromiseValues,
    pluginPatternProcessors: _string_pattern_processor.pluginPatternProcessors
});