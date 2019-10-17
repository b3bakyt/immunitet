const { isBaseType, isPlainObject } = require('../utils');
const { applyStringProcessors }     = require('./string_pattern_processor');
const {
    ImmunitetException,
    ImmunitetExceptions}        = require('../exceptions');

const processObjectPatterns = (argumentValue, processors, argNumber, strict) => {
    const result = {};
    let errors = [];
    let i = 0;

    for (let argName in argumentValue) {
        let val = argumentValue[argName] || argumentValue[i];
        let processor = processors[argName] || processors[i];
        if (processor) {
            processor = processor.split('|');
            result[argName] = applyStringProcessors(val, processor, argName);
            i++;
            continue;
        }

        if (strict)
            errors.push({message: 'No validator specified for object field', argName});

        result[argName] = val;
        i++;
    }

    if (errors.length > 0)
        throw new ImmunitetExceptions(errors);

    return result;
};

module.exports = {
    processObjectPatterns,
};
