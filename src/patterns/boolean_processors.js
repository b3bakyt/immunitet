import {ImmunitetException} from "../exceptions";

const BOOLEAN_PROCESSORS = {
    'convert': (value) => {
        if (value === 'true')
            return true;

        if (value === 'false')
            return false;

        return Boolean(value);
    },
};

export const processBoolean = (value, processors, argNumber) => {
    const processorsList = processors.split(',');

    if (processorsList.length === 0)
        return value;

    processorsList.map((processor) => {
        if (!BOOLEAN_PROCESSORS[processor])
            throw new ImmunitetException('Wrong keyword given as an argument for Boolean type processor.', argNumber);

        value = BOOLEAN_PROCESSORS[processor].call(null, value);
    });

    return value;
};