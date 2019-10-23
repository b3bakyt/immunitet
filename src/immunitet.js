const { setLanguage, tr }                           = require('./languages');
const { ImmunitetException, ImmunitetExceptions }   = require('./exceptions');
const { ARG_TYPES }                                 = require('./constants/general');

const {
    isEmpty,
    isObject,
    isPromise,
    isBaseType,
    isPlainObject,
    hasPromiseValues,
} = require('./utils');

const {
    setAlias,
    createStringPatternProcessor,
    pluginPatternProcessors,
} = require('./patternProcessors/string_pattern_processor');

const {
    processFunctionPatterns,
} = require('./patternProcessors/function_pattern_processor');

const {
    processObjectPatterns,
} = require('./patternProcessors/object_pattern_processor');

const {PATTERN_PROCESSORS, PATTERN_PROCESSOR_ALIASES} = require('./patterns/string_patterns');

const ProcessorHandlers = {
    'string': createStringPatternProcessor(PATTERN_PROCESSORS, PATTERN_PROCESSOR_ALIASES),

    'function': processFunctionPatterns,

    'object': processObjectPatterns,
};

const im = {
    validateFunction(checkFn, processors, strict = true) {
        let fn = checkFn;
        if (!fn)
            fn = val => val;

        if (typeof fn !== 'function')
            throw new Error(tr['First argument must be a type of function or null.']);

        if (!processors || isEmpty(processors))
            throw new Error(tr['Processor must be specified.']);

        return (...args) => {
            try {
                return processArgumentsNRun(fn, args, processors, strict);
            }
            catch (exception) {
                if (exception instanceof ImmunitetException)
                    return [null, new ImmunitetExceptions({0: exception})];

                if (exception instanceof ImmunitetExceptions)
                    return [null, exception];

                throw exception;
            }
        }
    },

    validateValue(processors, strict = true) {
        if (!processors || isEmpty(processors))
            throw new Error(tr['Processor must be specified.']);

        let fn = (...values) => {
            if (values.length <= 1)
                return values.pop();

            return values;
        };

        return (...args) => {
            try {
                return processArgumentsNRun(fn, args, processors, strict);
            }
            catch (exception) {
                if (exception instanceof ImmunitetException)
                    return [null, new ImmunitetExceptions({0: exception})];

                if (exception instanceof ImmunitetExceptions)
                    return [null, exception];

                throw exception;
            }
        }
    },

    validatePromise(checkFn, processors, strict = true) {
        let fn = checkFn;
        if (!fn)
            fn = val => val;

        if (typeof fn !== 'function')
            throw new Error('First argument must be a type of function or null.');

        if (!processors || isEmpty(processors))
            throw new Error('Processor must be specified.');

        return (...args) => {
            try {
                if (!hasPromiseValues(args, processors))
                    return processArgumentsNRun(fn, args, processors, strict);

                return runFunctionWithPromiseArguments(fn, args, processors, strict);
            }
            catch (exception) {
                if (exception instanceof ImmunitetException)
                    return Promise.reject(new ImmunitetExceptions({0: exception}));

                if (exception instanceof ImmunitetExceptions)
                    return Promise.reject(exception);

                return Promise.reject(exception);
            }
        }
    },

};

const processArgumentsNRun = (fn, args, processors, strict) => {
    if (isEmpty(processors))
        return runFunction(fn, args);

    let argArray = Object.values(processArguments(args, processors, strict));

    return runFunction(fn, argArray);
};

const runFunctionWithPromiseArguments = function (fn, args, processors, strict) {
    let resolveValues = getPromiseValues(args);

    return resolveValues
        .then(resolvedArguments => {
            return processArgumentsNRun(fn, resolvedArguments, processors, strict)
        })
        .catch(error => {
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

function combineArguments(args, argumentsProcessors) {
    let combinedArguments = args.length === 1 ? args[0] : args;
    const processorsType  = typeof argumentsProcessors;
    const argsType        = typeof combinedArguments;

    if (!combinedArguments)
        return [combinedArguments];

    if (!Array.isArray(combinedArguments) && !Array.isArray(argumentsProcessors) && processorsType === 'object' &&  argsType === 'object') {
        Object.keys(argumentsProcessors)
            .forEach(key => {
                if (!combinedArguments[key])
                    combinedArguments[key] = undefined;
            });
    }

    return args.length === 1 ? [combinedArguments]: combinedArguments;
}

const processArguments = (arguments, argumentsProcessors, strict) => {
    const errors         = {};
    const processedArgs  = [];
    const processorsType = typeof argumentsProcessors;
    const args           = combineArguments(arguments, argumentsProcessors);
    const argsType       = args.length <= 1 ? ARG_TYPES.simple : ARG_TYPES.multiple;

    if (!ProcessorHandlers[processorsType])
        throw new ImmunitetException(tr['Unknown argument processor "{0}"'].format(processorsType), 0);

    if (argsType === ARG_TYPES.multiple && processorsType !== 'object')
        throw new ImmunitetException(tr['Multiple arguments found! Validation rules must be type of object or array.']);

    const isSimpleValueSimpleProcessor  = argsType === ARG_TYPES.simple && isBaseType(args[0])    && isBaseType(argumentsProcessors);
    const isSimpleValueObjectProcessor  = argsType === ARG_TYPES.simple && isBaseType(args[0])    && (isObject(argumentsProcessors) && argumentsProcessors.length === 1);
    const isObjectValueSimpleProcessor  = argsType === ARG_TYPES.simple && isObject(args[0])      && isBaseType(argumentsProcessors);
    const isObjectValueObjectProcessor  = argsType === ARG_TYPES.simple && isPlainObject(args[0]) && (isObject(argumentsProcessors) || argumentsProcessors.length === 1);
    const isArrayValueArrayProcessor    = argsType === ARG_TYPES.simple && Array.isArray(args[0]) && (Array.isArray(argumentsProcessors) || argumentsProcessors.length === 1);

    if (isSimpleValueSimpleProcessor
        || isSimpleValueObjectProcessor || isObjectValueSimpleProcessor
        || isObjectValueObjectProcessor || isArrayValueArrayProcessor) {
        const result = ProcessorHandlers[processorsType].call(null, args.shift(), argumentsProcessors, 0, strict);
        return [result];
    }

    let argIndex = 0;

    for (let varName in argumentsProcessors) {
        if (!argumentsProcessors.hasOwnProperty(varName))
            continue;

        argIndex++;
        const processors = argumentsProcessors[varName];
        if (!processors)
            continue;

        let argumentValue = args.shift();

        const processorsType = typeof processors;
        if (!ProcessorHandlers[processorsType]) {
            errors[varName] = {
                message: tr['Unknown argument processor "{0}"'].format(processorsType),
                argName: varName,
            };
        }

        try {
            let processedArgument = ProcessorHandlers[processorsType].call(null, argumentValue, processors, varName, strict);
            processedArgs.push(processedArgument);
        } catch (error) {
            if (error instanceof ImmunitetException)
                errors[varName] = error;
            else
                throw error;
        }
    }

    if (strict && args.length > 0) {
        args.forEach((val, index) => {
            const argName = argIndex + index;
            errors[argName] = {
                message: tr['No validator specified for object field'],
                argName,
            };
        });
    }

    if (Object.keys(errors).length > 0)
        throw new ImmunitetExceptions(errors);

    return [...processedArgs, ...args];
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
    setLanguage,
};
