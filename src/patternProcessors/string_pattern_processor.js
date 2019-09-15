import {PATTERN_FLAGS} from '../constants/processor_flags';
import {isEmpty} from '../utils';
import {ImmunitetEmptyValueException} from "../exceptions";

let PATTERN_PROCESSOR_ALIASES = {};
let PATTERN_PROCESSORS = {};

export const setAlias = (newProcessorName, processors) => {
    PATTERN_PROCESSOR_ALIASES[newProcessorName] = processors;
};

export const pluginPatternProcessors = (patternProcessors) => {
    if (Array.isArray(patternProcessors) || isEmpty(patternProcessors))
        throw new Error('The pattern processors object must not be empty! '+ JSON.stringify(patternProcessors));

    PATTERN_PROCESSORS = {...PATTERN_PROCESSORS, ...patternProcessors};
    return true;
};

export const createStringPatternProcessor = (patternProcessors, patternProcessorAliases) => {
    PATTERN_PROCESSOR_ALIASES = {...PATTERN_PROCESSOR_ALIASES, ...patternProcessorAliases};
    PATTERN_PROCESSORS = {...PATTERN_PROCESSORS, ...patternProcessors};

    return processStringPatterns;
};

export const processStringPatterns = (argumentValue, processors, argNumber) => {
    let processorsList;
    if (processors.indexOf("||") === -1)
        processorsList = processors.split('|');
    else
        processorsList = [processors];

    return applyStringProcessors(argumentValue, processorsList, argNumber);
};

export const applyStringProcessors = (argumentValue, processorsList, argNumber) => {
    try {
        return processorsList.reduce((result, processor) => {
            if (PATTERN_PROCESSOR_ALIASES[processor]) {
                return applyStringProcessors(result, PATTERN_PROCESSOR_ALIASES[processor].split('|'), argNumber);
            }

            const [processorType, ...params] = processor.split(':');
            if (!processorType)
                return result;

            if (!PATTERN_PROCESSORS[processorType])
                throw new Error('Unknown argument processor "'+ processorType +'"!');

            if (PATTERN_PROCESSORS[processorType] === PATTERN_FLAGS.PASS)
                return result;

            if (typeof PATTERN_PROCESSORS[processorType] !== 'function') {
                return result;
            }

            console.log('applyStringProcessors:', processorType, result, params, argNumber);
            return PATTERN_PROCESSORS[processorType].call(null, result, params.join(':'), argNumber);

        }, argumentValue);
    } catch (e) {
        console.log('applyStringProcessors exception:', e.className, e instanceof ImmunitetEmptyValueException);
        if (e instanceof ImmunitetEmptyValueException)
            return e.arg;
        throw e;
    }
};
