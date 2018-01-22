
export const processFunctionPatterns = (argumentValue, processors) => {
    return processors.call(null, argumentValue);
};