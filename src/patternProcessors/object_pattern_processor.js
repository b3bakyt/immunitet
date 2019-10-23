const { tr }                        = require('../languages');
const { isBaseType, isPlainObject } = require('../utils');
const { applyStringProcessors }     = require('./string_pattern_processor');
const { ImmunitetExceptions }       = require('../exceptions');

const processObjectPatterns = (arguments, processors, argNumber, strict) => {
    const result = {};
    const argumentValues = {...arguments};
    let errors = {};
    let i = 0;

    for (let argName in argumentValues) {
        let val = argumentValues[argName];
        let processor = processors[argName] || processors[i];
        if (processor) {
            try {
                processor = processor.split('|');
                result[argName] = applyStringProcessors(val, processor, argName);
            }
            catch (exception) {
                errors[argName] = {message: tr['No validator specified for object field'], argName};
            }

            i++;
            continue;
        }

        if (strict)
            errors[argName] = {message: tr['No validator specified for object field'], argName};

        result[argName] = val;
        i++;
    }

    if (Object.values(errors).length > 0)
        throw new ImmunitetExceptions(errors);

    return result;
};

module.exports = {
    processObjectPatterns,
};
