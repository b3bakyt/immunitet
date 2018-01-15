
export const processObjectPatterns = (argumentValue, processors) => {
    return processors.call(null, argumentValue);
};