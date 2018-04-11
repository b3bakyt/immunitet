import {PATTERN_FLAGS} from '../constants/processor_flags';
import {ImmunitetException} from '../exceptions';
import {applyStringProcessors} from '../patternProcessors/string_pattern_processor';

import {
    isEmpty,
    isNumeric,
} from '../utils';

export const PatternProcessors = {
    'promise': PATTERN_FLAGS.PASS,

    'number': (value) => {
        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        return +value;
    },

    'round': (value) => {
        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        return Math.round(value);
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

    'min': (value, minValue) => {
        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        if (value < minValue)
            throw new ImmunitetException('The given value is less then '+ minValue);

        return value;
    },

    'max': (value, maxValue) => {
        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        if (value > maxValue)
            throw new ImmunitetException('The given value is greater then '+ maxValue);

        return value;
    },

    'minLength': (value, length) => {
        if ((value+'').length < length)
            throw new ImmunitetException('String min length is '+ length + ' symbols!');

        return value;
    },

    'maxLength': (value, length) => {
        if ((value+'').length > length)
            throw new ImmunitetException('String max length is '+ length + ' symbols!');

        return value;
    },
};

export const PatternProcessorAliases = {

};