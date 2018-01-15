import {ImmunitetException} from './exceptions';
import {
    isPromise,
    hasPromiseValues,
    convertToArray,
    isEmpty,
    pluginPatternProcessors,
} from './utils';

import {
    setAlias,
    processStringPatterns,
} from './patternProcessors/string_pattern_processor';

import {
    processFunctionPatterns,
} from './patternProcessors/function_pattern_processor';


const ProcessorHandlers = {
    'string': processStringPatterns,

    'function': processFunctionPatterns,

    'object': processFunctionPatterns,
};

const im = {
    check(checkFn, processors) {
        let fn = checkFn;
        if (!fn)
            fn = val => val;

        if (typeof fn !== 'function')
            throw new Error('First argument must be a type of function or null!');

        const arrayProcessors = convertToArray(processors);

        return (...args) => {
            try {
                return processArgumentsNRun(fn, args, arrayProcessors);
            }
            catch (exception) {
                // console.error('processedArgument.exception:', exception);
                if (exception instanceof ImmunitetException)
                    return [null, exception];

                throw exception;
            }
        }
    },

    checkPromise(checkFn, processors) {
        let fn = checkFn;
        if (!fn)
            fn = val => val;

        if (typeof fn !== 'function')
            throw new Error('First argument must be a type of function or null!');

        const arrayProcessors = convertToArray(processors);

        return (...args) => {
            try {
                if (!hasPromiseValues(args, arrayProcessors))
                    return processArgumentsNRun(fn, args, arrayProcessors);

                return runFunctionWithPromiseArguments(fn, args, arrayProcessors);
            }
            catch (exception) {
                if (exception instanceof ImmunitetException)
                    return Promise.reject(exception);

                // console.log('checkPromise. Caught an error:', exception);
                return Promise.reject(exception);
            }
        }
    },

};

const processArgumentsNRun = (fn, args, processors) => {
    if (isEmpty(processors))
        return runFunction(fn, args);

    let argArray = processArguments(args, processors);

    return runFunction(fn, argArray);
};

const runFunctionWithPromiseArguments = function (fn, args, processors) {
    let resolveValues = getPromiseValues(args);

    return resolveValues
        .then(resolvedArguments => {
            return processArgumentsNRun(fn, resolvedArguments, processors)
        })
        .catch(error => {
            console.error('processArgumentsNRun.error:', error);
            return Promise.reject(error);
        })
};

const runFunction = (fn, argArray) => {
    let functionResult = fn.apply(null, argArray);

    if (!isPromise(functionResult))
        return [functionResult, null];

    function successHandler(result) {
        return result;
    }

    function catchHandler(error) {
        return Promise.reject(error);
    }

    return functionResult
        .then(successHandler)
        .catch(catchHandler);
};

const processArguments = (args, argumentsProcessors) => {
    const processedArguments = [];

    for (let i = 0; i < argumentsProcessors.length; i++) {
        const processors = argumentsProcessors[i];
        // console.log('processors:', processors);
        if (!processors)
            continue;

        let argumentValue = args.shift();

        const processorsType = typeof processors;
        // console.log('processorsType:', processorsType);
        if (!ProcessorHandlers[processorsType])
            throw new Error('Unknown argument processor "'+ processorsType +'"');

        let processedArgument = ProcessorHandlers[processorsType].call(null, argumentValue, processors);
        processedArguments.push(processedArgument);
    }

    return [...processedArguments, ...args];
};

const getPromiseValues = (values) => {
    const promises = valuesToPromises(values);

    function successHandler(result) {
        return result;
    }

    function catchHandler(error) {
        return error;
    }

    const reflect = promise => promise
        .then(successHandler)
        .catch(catchHandler);

    return Promise.all(promises.map(reflect));
};

const valuesToPromises = (values) => {
    if (isEmpty(values))
        return values;

    return values.map(value => {
        if (isPromise(value))
            return value;

        return Promise.resolve(value);
    })
};

module.exports = {
    ...im,
    setAlias,
    ImmunitetException,
    isPromise,
    hasPromiseValues,
    valuesToPromises,
    getPromiseValues,
    pluginPatternProcessors,
};