
export const processFunctionPatterns = (argumentValue, processors, argNumber) => {
    return processors.call(null, argumentValue, argNumber);
};