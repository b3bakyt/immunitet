const { isBaseType, isPlainObject } = require('../utils');
const { applyStringProcessors }     = require('./string_pattern_processor');
const {
    ImmunitetException,
    ImmunitetExceptions}        = require('../exceptions');

const processObjectPatterns = (arguments, processors, argNumber, strict) => {
    const result = {};
    const argumentValues = {...arguments};
    let errors = [];
    let i = 0;

    if (isPlainObject(arguments) && isPlainObject(processors)) {
        Object.keys(processors).forEach(fieldName => {
            if (arguments[fieldName] === undefined)
                argumentValues[fieldName] = undefined;

        });
    }

    for (let argName in argumentValues) {
        let val = argumentValues[argName];
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
