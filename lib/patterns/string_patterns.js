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
};

export const PatternProcessorAliases = {

};