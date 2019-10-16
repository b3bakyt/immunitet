const { isBaseType } = require('../utils');

const { applyStringProcessors } = require('./string_pattern_processor');

const processObjectPatterns = (argumentValue, processors, argNumber) => {
    const result = {};
    if (isBaseType(argumentValue))
        return applyStringProcessors(argumentValue, processors, argNumber);

    let i = 0;
    for (let argName in argumentValue) {
        let val = argumentValue[argName] || argumentValue[i];
        let processor = processors[argName] || processors[i];
        processor = processor.split('|');
        result[argName] = applyStringProcessors(val, processor, argName);
        i++
    }

    return result;
};

module.exports = {
    processObjectPatterns,
};
