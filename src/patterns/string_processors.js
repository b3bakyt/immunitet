import {ImmunitetException} from "../exceptions";

const STRING_PROCESSORS = {
    'toUpperCase': (value) => {
        return (''+value).toUpperCase();
    },

    'toLowerCase': (value) => {
        return (''+value).toLowerCase();
    },

    'capitalFirst': (value) => {
        return (''+value).replace(/^\w/g, l => l.toUpperCase());
    },

    'capitalFirstLetter': (value) => {
        return (''+value).replace(/\b\w/g, l => l.toUpperCase());
    },
};

export const processString = (value, processors, argNumber) => {
    const processorsList = processors.split(',');

    if (processorsList.length === 0)
        return value;

    processorsList.map((processor) => {
        if (!STRING_PROCESSORS[processor])
            throw new ImmunitetException('Wrong keyword given as an argument for String type processor.', argNumber);

        value = STRING_PROCESSORS[processor].call(null, value);
    });

    return value;
};