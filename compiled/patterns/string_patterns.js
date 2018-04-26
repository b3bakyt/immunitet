'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PATTERN_PROCESSOR_ALIASES = exports.PATTERN_PROCESSORS = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _processor_flags = require('../constants/processor_flags');

var _exceptions = require('../exceptions');

var _string_pattern_processor = require('../patternProcessors/string_pattern_processor');

var _number_processors = require('./number_processors');

var _string_processors = require('./string_processors');

var _boolean_processors = require('./boolean_processors');

var _pattern_processors = require('./pattern_processors');

var _default_value_processors = require('./default_value_processors');

var _utils = require('../utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getProcessorsObject = function getProcessorsObject(processors) {
    var processorsList = processors.split(',');
    var newObjectList = {};
    var newArrayList = [];
    processorsList.forEach(function (processor) {
        if (processor.indexOf(')') > 1) {
            var propName = processor.slice(0, processor.indexOf(')')).slice(processor.indexOf('(') + 1);

            var value = processor.slice(processor.indexOf(')') + 1);

            if (newArrayList.length) {
                newArrayList = [].concat(_toConsumableArray(newArrayList), [value]);
                newObjectList = {};
                return;
            }

            newObjectList[propName] = value;
            return;
        }

        if (Object.values(newObjectList).length) {
            newArrayList = [].concat(_toConsumableArray(Object.values(newObjectList)), [processor]);
            newObjectList = {};
            return;
        }

        newArrayList.push(processor);
    });

    return newArrayList.length ? newArrayList : newObjectList;
};

var getPropertyProcessors = function getPropertyProcessors(processorsList, prop, argNumber) {
    if (Object.prototype.toString.call(processorsList) !== '[object Object]') return processorsList.shift();

    if (!processorsList[prop]) throw new _exceptions.ImmunitetException('No validation processor is specified for an Object property ' + prop + '!', argNumber);

    return processorsList[prop];
};

var PATTERN_PROCESSORS = {
    'promise': function promise(value, processors, argNumber) {
        if (!value) throw new _exceptions.ImmunitetException('Given argument is not type of promise!', argNumber);

        if (!value.then || typeof value.then !== 'function') throw new _exceptions.ImmunitetException('Given argument is not type of promise!', argNumber);

        return value;
    },

    'number': function number(value, processors, argNumber) {
        if (value === '') throw new _exceptions.ImmunitetException('Given argument is not type of number!', argNumber);

        if (processors) value = (0, _number_processors.processNumber)(value, processors, argNumber);

        if (typeof value === 'string') throw new _exceptions.ImmunitetException('Given argument is not type of number!', argNumber);

        if (!(0, _utils.isNumeric)(value)) throw new _exceptions.ImmunitetException('Given argument is not type of number!', argNumber);

        return value;
    },

    'integer': function integer(value, processors, argNumber) {
        if (value === '') throw new _exceptions.ImmunitetException('Given argument is not type of integer!', argNumber);

        if (processors) value = (0, _number_processors.processNumber)(value, processors);

        if (typeof value === 'string') throw new _exceptions.ImmunitetException('Given argument is not type of integer!', argNumber);

        if (!Number.isInteger(value)) throw new _exceptions.ImmunitetException('Given argument is not type of integer!', argNumber);

        return value;
    },

    'string': function string(value, processors, argNumber) {
        if (!value) throw new _exceptions.ImmunitetException('Argument can not be empty.', argNumber);

        if (typeof value !== 'string') throw new _exceptions.ImmunitetException('Given argument is not type of string!', argNumber);

        if (processors) value = (0, _string_processors.processString)(value, processors, argNumber);

        return value;
    },

    'array': function array(value, processors, argNumber) {
        if (!value) throw new _exceptions.ImmunitetException('Argument can not be empty.', argNumber);

        if (Object.prototype.toString.call(value) !== '[object Array]') throw new _exceptions.ImmunitetException('Given argument is not type of Array!', argNumber);

        return [].concat(_toConsumableArray(value));
    },

    'object': function object(value, processors, argNumber) {
        if (!value) throw new _exceptions.ImmunitetException('Argument can not be empty.', argNumber);

        if (Object.prototype.toString.call(value) !== '[object Object]') throw new _exceptions.ImmunitetException('Given argument is not type of Array!', argNumber);

        if (!processors) return _extends({}, value);

        var processorsList = getProcessorsObject(processors);

        var result = void 0,
            error = void 0;
        for (var prop in value) {
            if (!value.hasOwnProperty(prop)) continue;

            var propProcessors = getPropertyProcessors(processorsList, prop);

            result = (0, _string_pattern_processor.applyStringProcessors)(value[prop], [propProcessors]);

            value[prop] = result;
        }

        return value;
    },

    'function': function _function(value, processors, argNumber) {
        if (!value) throw new _exceptions.ImmunitetException('Given argument is not type of function!', argNumber);

        if (typeof value !== 'function') throw new _exceptions.ImmunitetException('Given argument is not type of function!', argNumber);

        return value;
    },

    'boolean': function boolean(value, processors, argNumber) {
        if (!value && typeof value !== 'boolean') throw new _exceptions.ImmunitetException('Required argument not found.', argNumber);

        if (processors) value = (0, _boolean_processors.processBoolean)(value, processors, argNumber);

        if (typeof value !== 'boolean') throw new _exceptions.ImmunitetException('Given argument is not type of boolean!', argNumber);

        return value;
    },

    'split': function split(value, splitter) {
        var cleanedSplitter = splitter.trim();
        if (!cleanedSplitter) return value;

        if (!value) return value;

        return (value + '').split(cleanedSplitter);
    },

    'each': function each(values, processors) {
        if ((0, _utils.isEmpty)(values)) return values;

        if (!processors) return values;

        var processorsList = processors.split(',');

        return values.map(function (value) {
            return (0, _string_pattern_processor.applyStringProcessors)(value, processorsList);
        });
    },

    'minimum': function minimum(value, minValue, argNumber) {
        if (!(0, _utils.isNumeric)(minValue)) throw new _exceptions.ImmunitetException('Minimum parameter is not type of number!', argNumber);

        if (!(0, _utils.isNumeric)(value)) throw new _exceptions.ImmunitetException('Given argument is not type of number!', argNumber);

        if (typeof value === 'string') value = +value;

        minValue = +minValue;

        if (value < minValue) throw new _exceptions.ImmunitetException('The given value is less then ' + minValue, argNumber);

        return value;
    },

    'maximum': function maximum(value, maxValue, argNumber) {
        if (!(0, _utils.isNumeric)(maxValue)) throw new _exceptions.ImmunitetException('Maximum parameter is not type of number!', argNumber);

        if (!(0, _utils.isNumeric)(value)) throw new _exceptions.ImmunitetException('Given argument is not type of number!', argNumber);

        if (typeof value === 'string') value = +value;

        maxValue = +maxValue;

        if (value > maxValue) throw new _exceptions.ImmunitetException('The given value is greater then ' + maxValue, argNumber);

        return value;
    },

    'minLength': function minLength(value, length, argNumber) {
        if (!(0, _utils.isNumeric)(length)) throw new _exceptions.ImmunitetException('minLength parameter is not type of number!', argNumber);

        length = +length;

        if ((value + '').length < length) throw new _exceptions.ImmunitetException('String minimum length must be ' + length + ' symbols!', argNumber);

        return value;
    },

    'maxLength': function maxLength(value, length, argNumber) {
        if (!(0, _utils.isNumeric)(length)) throw new _exceptions.ImmunitetException('maxLength parameter is not type of number!', argNumber);

        length = +length;

        if ((value + '').length > length) throw new _exceptions.ImmunitetException('String maximum length must be ' + length + ' symbols!', argNumber);

        return value;
    },

    'pattern': function pattern(value, _pattern, argNumber) {
        if (typeof _pattern !== 'string') throw new _exceptions.ImmunitetException('Given pattern is not type of string.', argNumber);

        _pattern = _pattern.trim();

        if (!value) throw new _exceptions.ImmunitetException('Argument can not be empty.', argNumber);

        if (!_pattern) throw new _exceptions.ImmunitetException('Pattern can not be empty.', argNumber);

        if (!(0, _pattern_processors.processRegexp)(value, _pattern, argNumber)) throw new _exceptions.ImmunitetException('Supplied value does not match given pattern.', argNumber);

        return value;
    },

    'default': function _default(value, defaultValue, argNumber) {
        if (typeof defaultValue === 'undefined') throw new _exceptions.ImmunitetException('Default value was not specified.', argNumber);

        if (defaultValue && typeof value === 'undefined') value = (0, _default_value_processors.processDefaultValue)(value, defaultValue);

        return value;
    },

    'date': function date(value, format, argNumber) {
        // RFC 3339
        if (!value) throw new _exceptions.ImmunitetException('Date argument can not be empty.', argNumber);

        /*
        // example "2005-08-15T15:52:01+00:00"
        pattern = "yyyy-MM-dd'T'HH:mm:ssXXX";
         // example "2016-11-01T20:44:39Z"
        pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'";
         // example "1937-01-01T12:00:27.87Z"
        pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
         // 1996-12-19T16:39:57-08:00
        pattern = "yyyy-MM-dd'T'HH:mm:ssXXX";
         // 1990-12-31T23:59:60Z
        pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'";
         // 1990-12-31T15:59:60-08:00
        pattern = "yyyy-MM-dd'T'HH:mm:ssXXX";
         // 1937-01-01T12:00:27.87+00:20
        pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
         */
        var pattern = '^(?:[1-9]\\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z|[+-][01]\\d:[0-5]\\d)$';
        var regexp = new RegExp(pattern, 'i');
        if (!regexp.test(value)) throw new _exceptions.ImmunitetException('Given value is not type of RFC3339 date.', argNumber);

        return value;
    },

    'email': function email(value, argument, argNumber) {
        // RFC5322
        if (!value) throw new _exceptions.ImmunitetException('Email argument can not be empty.', argNumber);

        var pattern = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        var regexp = new RegExp(pattern);
        if (!regexp.test(value)) throw new _exceptions.ImmunitetException('Given value is not type of RFC5322 email.', argNumber);

        return value;
    },

    'time': function time(value, argument, argNumber) {

        return null;
    },

    'date-time': function dateTime(value, argument, argNumber) {

        return null;
    },

    'uri': function uri(value, argument, argNumber) {

        return null;
    },

    'hostname': function hostname(value, argument, argNumber) {

        return null;
    },

    'ipv4': function ipv4(value, argument, argNumber) {

        return null;
    },

    'ipv6': function ipv6(value, argument, argNumber) {

        return null;
    },

    'uuid': function uuid(value, argument, argNumber) {

        return null;
    },

    'json-pointer': function jsonPointer(value, argument, argNumber) {

        return null;
    },

    'relative-json-pointer': function relativeJsonPointer(value, argument, argNumber) {

        return null;
    }
};

exports.PATTERN_PROCESSORS = PATTERN_PROCESSORS;
var PATTERN_PROCESSOR_ALIASES = exports.PATTERN_PROCESSOR_ALIASES = {};