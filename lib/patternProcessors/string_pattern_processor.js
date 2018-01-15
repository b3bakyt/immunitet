import {PatternProcessors} from '../patterns/string_patterns';
import {PATTERN_FLAGS} from '../constants/processor_flags';

const ComposedPatternProcessors = {};

export const setAlias = (newProcessorName, processors) => {
    ComposedPatternProcessors[newProcessorName] = processors;
};

export const processStringPatterns = (argumentValue, processors) => {
    const processorsList = processors.split('|');
    // console.log('processorsList.string:', argumentValue, processorsList);
    return applyStringProcessors(argumentValue, processorsList);
};

export const applyStringProcessors = (argumentValue, processorsList) => {
    return processorsList.reduce((result, processor) => {
        if (ComposedPatternProcessors[processor]) {
            return applyStringProcessors(result, ComposedPatternProcessors[processor].split('|'));
        }

        const [processorType, params] = processor.split(':');
        if (!processorType)
            return result;

        if (!PatternProcessors[processorType])
            throw new Error('Unknown argument processor "'+ processorType +'"!');

        if (PatternProcessors[processorType] === PATTERN_FLAGS.PASS)
            return result;

        if (typeof PatternProcessors[processorType] !== 'function') {
            // :todo log error!
            return result;
        }

        return PatternProcessors[processorType].call(null, result, params);
    }, argumentValue);
};