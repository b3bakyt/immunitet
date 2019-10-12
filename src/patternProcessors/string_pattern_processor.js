const { PATTERN_FLAGS }                 = require('../constants/general');
const { isEmpty }                       = require('../utils');
const { ImmunitetEmptyValueException }  = require("../exceptions");

let PATTERN_PROCESSOR_ALIASES = {};
let PATTERN_PROCESSORS        = {};

const setAlias = (newProcessorName, processors) => {
    PATTERN_PROCESSOR_ALIASES[newProcessorName] = processors;
};

const pluginPatternProcessors = (patternProcessors) => {
    if (Array.isArray(patternProcessors) || isEmpty(patternProcessors) || !patternProcessors)
        throw new Error('The pattern processors object must not be empty! '+ JSON.stringify(patternProcessors));

    PATTERN_PROCESSORS = {...PATTERN_PROCESSORS, ...patternProcessors};
    return true;
};

const createStringPatternProcessor = (patternProcessors, patternProcessorAliases) => {
    PATTERN_PROCESSOR_ALIASES = {...PATTERN_PROCESSOR_ALIASES, ...patternProcessorAliases};
    PATTERN_PROCESSORS = {...PATTERN_PROCESSORS, ...patternProcessors};

    return processStringPatterns;
};

const processStringPatterns = (argumentValue, processors, argName) => {
    let processorsList;
    if (processors.indexOf("||") === -1)
        processorsList = processors.split('|');
    else
        processorsList = [processors];

    return applyStringProcessors(argumentValue, processorsList, argName);
};

const applyStringProcessors = (argumentValue, processorsList, argName) => {
    try {
        return processorsList.reduce((result, processor) => {
            if (PATTERN_PROCESSOR_ALIASES[processor]) {
                return applyStringProcessors(result, PATTERN_PROCESSOR_ALIASES[processor].split('|'), argName);
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

            return PATTERN_PROCESSORS[processorType].call(null, result, params.join(':'), argName);

        }, argumentValue);
    } catch (e) {
        if (e instanceof ImmunitetEmptyValueException)
            return e.arg;
        throw e;
    }
};

module.exports = {
    setAlias,
    pluginPatternProcessors,
    createStringPatternProcessor,
    processStringPatterns,
    applyStringProcessors,
};
