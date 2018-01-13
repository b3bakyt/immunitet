const isEmpty = (obj) => {
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }

    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

const isPromise = function (obj) {
    return !!obj
        && Object.prototype.toString.call(obj) === '[object Promise]';
};

const convertToArray = (obj) => {
    if (typeof obj === 'string')
        return [obj];

    if (Array.isArray(obj)) {
        return obj;
    }

    return Object.values(obj);
};

function ImmunitetException(message) {
    this.message = message;
    this.name = "immunity.js has found an error!";
};

const isNumeric = (value) => {
    const type = typeof value;
    return (type === 'number' || type === 'string') &&
        !isNaN(value - parseFloat(value));
};

const applyStringProcessors = (argumentValue, processorsList) => {
    let processedArgument = processorsList.reduce((result, processor) => {
        if (ComposedPatternProcessors[processor]) {
            return applyStringProcessors(result, ComposedPatternProcessors[processor].split('|'));
        }

        const [processorType, params] = processor.split(':');
        if (!processorType)
            return result;

        if (typeof PatternProcessors[processorType] !== 'function') {
            // :todo log error!
            return result;
        }

        return PatternProcessors[processorType].call(null, result, params);
    }, argumentValue);


    // console.log('processedArgument:', processedArgument);
    return processedArgument;
};

const ProcessorHandlers = {
    'string': (argumentValue, processors) => {
        const processorsList = processors.split('|');
        // console.log('processorsList.string:', argumentValue, processorsList);
        return applyStringProcessors(argumentValue, processorsList);
    },

    'function': (argumentValue, processors) => {
        // console.log('processorsList.function:', argumentValue, typeof processors);
        return processors.call(null, argumentValue);
    },
};

const PatternProcessors = {
    'number': (value) => {
        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        return +value;
    },

    'round': (value) => {
        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!');

        return Math.round(value);
    },

    'split': (value, splitter) => {
        const cleanedSplitter = splitter.trim();
        if (!cleanedSplitter)
            return value;

        if (!value)
            return value;

        return (value+'').split(cleanedSplitter);
    },

    'each': (values, processors) => {
        if (isEmpty(values))
            return values;

        if (!processors)
            return values;

        const processorsList = processors.split(',');

        let processedValues = values.map(value => {
            return applyStringProcessors(value, processorsList);
        });

        return processedValues;
    },
};

const ComposedPatternProcessors = {};

const setAlias = (newProcessorName, processors) => {
    ComposedPatternProcessors[newProcessorName] = processors;
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

    const res = functionResult
        .then(successHandler)
        .catch(catchHandler);

    return res;
};

const hasPromiseValues = (objects) => {
    if (isEmpty(objects))
        return false;

    return objects.find(object => isPromise(object)) !== undefined;
};

const processArguments = (args, rawProcessors) => {
    let argumentsProcessors = convertToArray(rawProcessors);

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

const processArgumentsNRun = (fn, args, processors) => {
    if (!processors || isEmpty(processors))
        return runFunction(fn, args);

    let argArray = processArguments(args, processors);

    return runFunction(fn, argArray);
}

const valuesToPromises = (values) => {
    if (isEmpty(values))
        return values;

    return values.map(value => {
        if (isPromise(value))
            return value;

        return Promise.resolve(value);
    })
}

const getPromiseValues = (values) => {
    const promises = valuesToPromises(values);
};

const im = {
    check(checkFn, processors) {
        let fn = checkFn;
        if (!fn)
            fn = val => val;

        if (typeof fn !== 'function')
            throw new Error('First argument must be a type of function or null!');

        return (...args) => {
            if (hasPromiseValues(args)) {

            }

            try {
                return processArgumentsNRun(fn, args, processors);
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

        return (...args) => {

            try {
                return processArgumentsNRun(fn, args, processors);
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

module.exports = {
    ...im,
    setAlias,
    ImmunitetException,
    isPromise,
    hasPromiseValues,
    valuesToPromises,
    getPromiseValues,
};