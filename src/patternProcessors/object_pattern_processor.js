const { isBaseType } = require('../utils');

const { applyStringProcessors } = require('./string_pattern_processor');

const processObjectPatterns = (argumentValue, processors, argNumber) => {
    const result = {};
    if (isBaseType(argumentValue))
        return applyStringProcessors(argumentValue, processors, argNumber);

    for (let argName in argumentValue) {
        result[argName] = applyStringProcessors(argumentValue, processors, argName);
    }

    return result;
};

module.exports = {
    processObjectPatterns,
};
