import {ImmunitetException} from "../exceptions";

export const NUMBER_PROCESSORS = {
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

export const processNumber = (value, processors) => {
    const processorsList = processors.split(',');

    if (processorsList.length === 0)
        return value;

    processorsList.map((processor) => {
        if (!NUMBER_PROCESSORS[processor])
            throw new ImmunitetException('Argument can not be empty.');

        value = NUMBER_PROCESSORS[processor].call(null, value);
    });

    return value;
};