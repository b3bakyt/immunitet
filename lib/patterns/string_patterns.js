import {PATTERN_FLAGS} from '../constants/processor_flags';
import {ImmunitetException} from '../exceptions';
import {applyStringProcessors} from '../patternProcessors/string_pattern_processor';
import {processNumber} from './number_processors';
import {processString} from './string_processors';
import {processBoolean} from './boolean_processors';

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

    'pattern': (value, length) => {

        return null;
    },

    'default': (value, length) => {

        return null;
    },

    'notNull': (value, argument) => {

        return null;
    },

    'notEmpty': (value, argument) => {

        return null;
    },

    'notFalsy': (value, argument) => {

        return null;
    },
};

export const PATTERN_PROCESSOR_ALIASES = {

};