const { tr }                        = require('../languages');
const { isObject, isPlainObject }   = require('../utils');
const { applyStringProcessors }     = require('./string_pattern_processor');
const { ImmunitetExceptions }       = require('../exceptions');

const processObjectPatterns = (arguments, processors, argNumber, strict) => {
    const result = Array.isArray(arguments) ? [] : {};
    const argumentValues = Array.isArray(arguments) ? [...arguments] : {...arguments};
    let errors = {};
    let i = 0;

    for (let argName in argumentValues) {
        let val = argumentValues[argName];
        let processor = processors[argName] || processors[i];

        if (isPlainObject(val) && isObject(processor)) {
            try {
                result[argName] = processObjectPatterns(val, processor, argName, strict);
            }
            catch (exception) {
                const errorObjects = {};
                exception.getErrors().forEach(error => {
                    let argKey = argName +':'+ error.argName;
                    errorObjects[argKey] = {message: error.message, argName: argKey};
                });
                errors = {...errors, ...errorObjects};
            }

            continue;
        }

        if (processor) {
            try {
                processor = processor.split('|');
                result[argName] = applyStringProcessors(val, processor, argName);
            }
            catch (exception) {
                let message = exception.message || tr['Data validation error.'];
                errors[argName] = {message, argName};
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
