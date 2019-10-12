
const processFunctionPatterns = (argumentValue, processors, argName) => {
    return processors.call(null, argumentValue, argName);
};

module.exports = {
    processFunctionPatterns,
};
