const DEFAULT_VALUE_PROCESSORS = {
    'true': true,
    'false': false,
    'null': null,
};

const processDefaultValue = (value, defaultValue) => {

    if (typeof DEFAULT_VALUE_PROCESSORS[defaultValue] !== 'undefined')
        defaultValue = DEFAULT_VALUE_PROCESSORS[defaultValue];

    return defaultValue;
};

module.exports = {
    processDefaultValue,
};
