const { ImmunitetException } = require("../exceptions");

const BOOLEAN_PROCESSORS = {
    'convert': (value) => {
        if (value === 'true')
            return true;

        if (value === 'false')
            return false;

        return Boolean(value);
    },
};

const processBoolean = (value, processors, argName) => {
    const processorsList = processors.split(',');

    if (processorsList.length === 0)
        return value;

    processorsList.map((processor) => {
        if (!BOOLEAN_PROCESSORS[processor])
            throw new ImmunitetException('Wrong keyword given as an argument for Boolean type processor.', argName);

        value = BOOLEAN_PROCESSORS[processor].call(null, value);
    });

    return value;
};

module.exports = {
    processBoolean,
};
