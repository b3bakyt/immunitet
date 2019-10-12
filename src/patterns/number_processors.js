const { ImmunitetException } = require("../exceptions");

const NUMBER_PROCESSORS = {
    'convert': (value) => {
        return Number(value);
    },

    'floor': (value) => {
        return Math.floor(value);
    },

    'round': (value) => {
        return Math.round(value);
    },

    'ceil': (value) => {
        return Math.ceil(value);
    },
};

const processNumber = (value, processors, argName) => {
    const processorsList = processors.split(',');

    if (processorsList.length === 0)
        return value;

    processorsList.map((processor) => {
        if (!NUMBER_PROCESSORS[processor])
            throw new ImmunitetException('Wrong keyword given as an argument for Number type processor.', argName);

        value = NUMBER_PROCESSORS[processor].call(null, value);
    });

    return value;
};

module.exports = {
    processNumber,
};
