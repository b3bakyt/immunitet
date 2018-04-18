import {PATTERN_FLAGS} from '../constants/processor_flags';
import {ImmunitetException} from '../exceptions';
import {applyStringProcessors} from '../patternProcessors/string_pattern_processor';
import {processNumber} from './number_processors';
import {processString} from './string_processors';
import {processBoolean} from './boolean_processors';
import {processRegexp} from "./pattern_processors";
import {processDefaultValue} from "./default_value_processors";

import {
    isEmpty,
    isNumeric,
} from '../utils';

export const PATTERN_PROCESSORS = {
    'promise': PATTERN_FLAGS.PASS,

    'number': (value, processors) => {
        if (value === '')
            throw new ImmunitetException('Given argument is not type of number!');

        if (processors)
            value = processNumber(value, processors);

        if (typeof value === 'string')
            throw new ImmunitetException('Given argument is not type of number!');

        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        return value;
    },

    'integer': (value, processors) => {
        if (value === '')
            throw new ImmunitetException('Given argument is not type of integer!');

        if (processors)
            value = processNumber(value, processors);

        if (typeof value === 'string')
            throw new ImmunitetException('Given argument is not type of integer!');

        if (!Number.isInteger(value))
            throw new ImmunitetException('Given argument is not type of integer!');

        return value;
    },

    'string': (value, processors) => {
        if (!value)
            throw new ImmunitetException('Argument can not be empty.');

        if (typeof value !== 'string')
            throw new ImmunitetException('Given argument is not type of string!');

        if (processors)
            value = processString(value, processors);

        return value;
    },

    'array': (value, processors) => {
        if (!value)
            throw new ImmunitetException('Argument can not be empty.');

        if (Object.prototype.toString.call(value) !== '[object Array]')
            throw new ImmunitetException('Given argument is not type of Array!');

        return value;
    },

    'object': (value, processors) => {
        if (!value)
            throw new ImmunitetException('Argument can not be empty.');

        if (Object.prototype.toString.call(value) !== '[object Object]')
            throw new ImmunitetException('Given argument is not type of Array!');

        return value;
    },

    'boolean': (value, processors) => {
        if (!value && typeof value !== 'boolean')
            throw new ImmunitetException('Required argument not found.');

        if (processors)
            value = processBoolean(value, processors);

        if (typeof value !== 'boolean')
            throw new ImmunitetException('Given argument is not type of boolean!');

        return value;
    },

    'split': (value, splitter) => {
        const cleanedSplitter = splitter.trim();
        if (!cleanedSplitter)
            return value;

        if (!value)
            return value;

        return (value+'').split(cleanedSplitter);
    },

    'each': (values, processors) => {
        if (isEmpty(values))
            return values;

        if (!processors)
            return values;

        const processorsList = processors.split(',');

        return values.map(value => {
            return applyStringProcessors(value, processorsList);
        });
    },

    'minimum': (value, minValue) => {
        if (!isNumeric(minValue))
            throw new ImmunitetException('Minimum parameter is not type of number!');

        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        if (typeof value === 'string')
            value = +value;

        minValue = +minValue;

        if (value < minValue)
            throw new ImmunitetException('The given value is less then '+ minValue);

        return value;
    },

    'maximum': (value, maxValue) => {
        if (!isNumeric(maxValue))
            throw new ImmunitetException('Maximum parameter is not type of number!');

        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        if (typeof value === 'string')
            value = +value;

        maxValue = +maxValue;

        if (value > maxValue)
            throw new ImmunitetException('The given value is greater then '+ maxValue);

        return value;
    },

    'minLength': (value, length) => {
        if (!isNumeric(length))
            throw new ImmunitetException('minLength parameter is not type of number!');

        length = +length;

        if ((value+'').length < length)
            throw new ImmunitetException('String minimum length must be '+ length + ' symbols!');

        return value;
    },

    'maxLength': (value, length) => {
        if (!isNumeric(length))
            throw new ImmunitetException('maxLength parameter is not type of number!');

        length = +length;

        if ((value+'').length > length)
            throw new ImmunitetException('String maximum length must be '+ length + ' symbols!');

        return value;
    },

    'pattern': (value, pattern) => {
        pattern = pattern.trim();

        if (!value)
            throw new ImmunitetException('Argument can not be empty.');

        if (!pattern)
            throw new ImmunitetException('Pattern can not be empty.');

        if (typeof pattern !== 'string')
            throw new ImmunitetException('Given pattern is not type of string.');

        if (!processRegexp(value, pattern))
            throw new ImmunitetException('Supplied value does not match given pattern.');

        return value;
    },

    'default': (value, defaultValue) => {
        if (typeof defaultValue === 'undefined')
            throw new ImmunitetException('Default value was not specified.');

        if (defaultValue && typeof value === 'undefined')
            value = processDefaultValue(value, defaultValue);

        return value;
    },

    'date': (value, format) => { // RFC 3339
        if (!value)
            throw new ImmunitetException('Date argument can not be empty.');

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
        let pattern = '^(?:[1-9]\\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z|[+-][01]\\d:[0-5]\\d)$';
        let regexp = new RegExp(pattern, 'i');
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of RFC3339 date.');

        return value;
    },

    'email': (value, argument) => {// RFC5322
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.');

        let pattern = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of RFC5322 email.');

        return value;
    },

    'time': (value, argument) => {

        return null;
    },

    'date-time': (value, argument) => {

        return null;
    },

    'uri': (value, argument) => {

        return null;
    },

    'hostname': (value, argument) => {

        return null;
    },

    'ipv4': (value, argument) => {

        return null;
    },

    'ipv6': (value, argument) => {

        return null;
    },

    'uuid': (value, argument) => {

        return null;
    },

    'json-pointer': (value, argument) => {

        return null;
    },

    'relative-json-pointer': (value, argument) => {

        return null;
    },
};

export const PATTERN_PROCESSOR_ALIASES = {

};