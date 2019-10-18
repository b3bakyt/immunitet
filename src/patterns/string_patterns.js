const { tr }                                            = require('../languages');
const { applyStringProcessors, processStringPatterns }  = require('../patternProcessors/string_pattern_processor');
const { processNumber }                                 = require('./number_processors');
const { processString }                                 = require('./string_processors');
const { processBoolean }                                = require('./boolean_processors');
const { processRegexp }                                 = require('./pattern_processors');
const { processDefaultValue }                           = require('./default_value_processors');
const {
    ImmunitetException,
    ImmunitetEmptyValueException,
} = require('../exceptions');

const {
    isEmpty,
    isNumeric,
    isInArray,
} = require('../utils');

let getProcessorsObject = function (processors) {
    let processorsList = processors.split('||');
    let newObjectList = {};
    let newArrayList = [];
    processorsList.forEach((processor) => {
        if (processor.indexOf(')') > 1) {
            let propName = processor.slice(0, processor.indexOf(')')).slice(processor.indexOf('(') + 1);
            let value = processor.slice(processor.indexOf(')') + 1);

            if (newArrayList.length) {
                newArrayList = [...newArrayList, value];
                newObjectList = {};
                return;
            }
            newObjectList[propName] = value;
            return;
        }

        if (Object.values(newObjectList).length) {
            newArrayList = [...Object.values(newObjectList), processor];
            newObjectList = {};
            return;
        }

        newArrayList.push(processor);
    });

    return newArrayList.length ? newArrayList : newObjectList;
};

let getPropertyProcessors = function (processorsList, prop, argName) {
    if (Object.prototype.toString.call(processorsList) !== '[object Object]')
        return processorsList.shift();

    if (!processorsList[prop])
        throw new ImmunitetException(tr['No validation processor is specified for an Object property {0}.'].format(prop), argName);

    const result = processorsList[prop];
    delete processorsList[prop];
    return result;
};

const PATTERN_PROCESSORS = {

    'empty': (value, splitter, argName) => {
        if (value === '' || value === null || value === undefined)
            throw new ImmunitetEmptyValueException(value, argName);

        return value;
    },

    'promise': (value, processors, argName) => {
        if (!value)
            throw new ImmunitetException(tr['Given argument is not type of promise.'], argName);

        if (!value.then || typeof value.then !== 'function')
            throw new ImmunitetException(tr['Given argument is not type of promise.'], argName);

        return value;
    },

    'number': (value, processors, argName) => {
        if (value === '')
            throw new ImmunitetException(tr['Given argument is not type of number.'], argName);

        if (processors)
            value = processNumber(value, processors, argName);

        if (typeof value === 'string')
            throw new ImmunitetException(tr['Given argument is not type of number.'], argName);

        if (!isNumeric(value))
            throw new ImmunitetException(tr['Given argument is not type of number.'], argName);

        return value;
    },

    'integer': (value, processors, argName) => {
        if (value === '')
            throw new ImmunitetException(tr['Given argument is not type of integer.'], argName);

        if (processors)
            value = processNumber(value, processors);

        if (typeof value === 'string')
            throw new ImmunitetException(tr['Given argument is not type of integer.'], argName);

        if (!Number.isInteger(value))
            throw new ImmunitetException(tr['Given argument is not type of integer.'], argName);

        return value;
    },


    'array': (value, processors, argName) => {
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        if (Object.prototype.toString.call(value) !== '[object Array]')
            throw new ImmunitetException('Given argument is not type of Array.', argName);

        return [...value];
    },

    'object': (userObject, processors, argName) => {
        if (!userObject)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        if (Object.prototype.toString.call(userObject) !== '[object Object]')
            throw new ImmunitetException(tr['Given argument is not type of Array.'], argName);

        if (!processors)
            return {...userObject};

        const processorsList = getProcessorsObject(processors);

        let result, i = 0;
        for (let prop in userObject) {
            i++;
            if (!userObject.hasOwnProperty(prop))
                continue;

            let propProcessors = getPropertyProcessors(processorsList, prop, argName + ':' + prop);
            result = processStringPatterns(userObject[prop], propProcessors, argName + ':' + prop);

            userObject[prop] = result;
        }

        let processorKeys = Object.keys(processorsList);
        if (processorKeys.length) {
            let firstKey = processorKeys.shift();
            firstKey = isNumeric(firstKey) ? i : firstKey;
            throw new ImmunitetException(tr['Given argument is not type of function.'], argName + ':' + firstKey);
        }

        return userObject;
    },

    'function': (value, processors, argName) => {
        if (!value)
            throw new ImmunitetException(tr['Given argument is not type of function.'], argName);

        if (typeof value !== 'function')
            throw new ImmunitetException(tr['Given argument is not type of function.'], argName);

        return value;
    },

    'boolean': (value, processors, argName) => {
        if (!value && typeof value !== 'boolean')
            throw new ImmunitetException(tr['Required argument not found.'], argName);

        if (processors)
            value = processBoolean(value, processors, argName);

        if (typeof value !== 'boolean')
            throw new ImmunitetException(tr['Given argument is not type of boolean.'], argName);

        return value;
    },

    'split': (value, splitter) => {
        const cleanedSplitter = splitter.trim();
        if (!cleanedSplitter)
            return value;

        if (!value)
            return value;

        return (value + '').split(cleanedSplitter);
    },

    'each': (values, processors, argName) => {
        if (isEmpty(values))
            return values;

        if (!processors)
            return values;

        const processorsList = processors.split(',');

        return values.map(value => {
            return applyStringProcessors(value, processorsList, argName);
        });
    },

    'enum': (value, processors, argName) => {
        let strValue = '' + value;

        if (!strValue
            || (value !== strValue && strValue === 'NaN')
            || (value !== strValue && strValue === 'null')
            || (value !== strValue && strValue === 'undefined')
            || (value !== strValue && strValue === 'false'))
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        let processorsList = '' + processors.split(',');

        if (processorsList.length === 0)
            throw new Error('No enum values was specified.');

        if (!isInArray(value, processorsList))
            throw new ImmunitetException(tr['Supplied value does not match given enum values.'], argName);

        return value;
    },

    'minimum': (value, minValue, argName) => {
        if (!isNumeric(minValue))
            throw new ImmunitetException(tr['Minimum parameter is not type of number.'], argName);

        if (!isNumeric(value))
            throw new ImmunitetException(tr['Given argument is not type of number.'], argName);

        if (typeof value === 'string')
            value = +value;

        minValue = +minValue;

        if (value < minValue)
            throw new ImmunitetException(tr['Argument is less then {0}'].format(minValue), argName);

        return value;
    },

    'maximum': (value, maxValue, argName) => {
        if (!isNumeric(maxValue))
            throw new ImmunitetException(tr['Maximum parameter is not type of number.'], argName);

        if (!isNumeric(value))
            throw new ImmunitetException(tr['Given argument is not type of number.'], argName);

        if (typeof value === 'string')
            value = +value;

        maxValue = +maxValue;

        if (value > maxValue)
            throw new ImmunitetException(tr['Argument is greater then {0}'].format(maxValue), argName);

        return value;
    },

    'minLength': (value, length, argName) => {
        if (!isNumeric(length))
            throw new ImmunitetException(tr['minLength parameter is not type of number.'], argName);

        length = +length;

        if ((value + '').length < length)
            throw new ImmunitetException(tr['String minimum length must be {0} symbols.'].format(length), argName);

        return value;
    },

    'maxLength': (value, length, argName) => {
        if (!isNumeric(length))
            throw new ImmunitetException(tr['maxLength parameter is not type of number.'], argName);

        length = +length;

        if ((value + '').length > length)
            throw new ImmunitetException(tr['String maximum length must be {0} symbols.'].format(length), argName);

        return value;
    },

    'pattern': (value, pattern, argName) => {
        if (typeof pattern !== 'string')
            throw new ImmunitetException(tr['Given pattern is not type of string.'], argName);

        pattern = pattern.trim();

        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        if (!pattern)
            throw new ImmunitetException(tr['Pattern can not be empty.'], argName);

        if (!processRegexp(value, pattern, argName))
            throw new ImmunitetException(tr['Supplied value does not match given pattern.'], argName);

        return value;
    },

    'default': (value, defaultValue, argName) => {
        if (typeof defaultValue === 'undefined')
            throw new ImmunitetException(tr['Default value was not specified.'], argName);

        if (defaultValue && typeof value === 'undefined')
            value = processDefaultValue(value, defaultValue);

        return value;
    },

    'date': (value, format, argName) => { // RFC 3339
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        /*
        // example "2005-08-15T15:52:01+00:00"
        pattern = "yyyy-MM-dd'T'HH:mm:ssXXX";

        // example "2016-11-01T20:44:39Z"
        pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'";

        // example "1937-01-01T12:00:27.87Z"
        pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

        // 1996-12-19T16:39:57-08:00
        pattern = "yyyy-MM-dd'T'HH:mm:ssXXX";

        // 1990-12-31T23:59:60Z
        pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'";

        // 1990-12-31T15:59:60-08:00
        pattern = "yyyy-MM-dd'T'HH:mm:ssXXX";

        // 1937-01-01T12:00:27.87+00:20
        pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX";
         */
        let pattern = '^(?:[1-9]\\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d(?:Z|[+-][01]\\d:[0-5]\\d)$';
        let regexp = new RegExp(pattern, 'i');
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of RFC3339 date.'], argName);

        return value;
    },

    'email': (value, argument, argName) => {// RFC5322
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        let pattern = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of RFC5322 email.'], argName);

        return value;
    },

    'string': (value, processors, argName) => {
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);

        if (typeof value !== 'string')
            throw new ImmunitetException(tr['Given argument is not type of string.'], argName);

        if (processors)
            value = processString(value, processors, argName);

        return value;
    },

    'alpha-numeric':(value,argument,argName)=>{
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);
        let pattern = '^(\\d|[a-zA-Z]|[\\s])+([\\da-zA-Z\\s?]+)$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of string or number.'], argName);
        return value;
    },
    'numeric':(value,argument,argName)=>{
        if (!value && value !== 0)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);
        let pattern = '([\\d]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of number.'], argName);
        return value;
    },
//latin and cyrillic
    'alpha':(value,argument,argName)=>{
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);
        let pattern = '^([а-яА-ЯёЁa-zA-Z]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of alpha string.'], argName);
        return value;
    },

    'latin':(value,argument,argName)=>{
        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);
        let pattern = '^([a-zA-Z]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not latin letters.'], argName);
        return value;
    },

    'cyrillic':(value,argument,argName)=>{
        if (!value)
            throw new ImmunitetException('Argument can not be empty.', argName);
        let pattern = '([а-яА-ЯёЁ]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not cyrillic letters.'], argName);
        return value;
    },

    'phone': (value, argument, argName) => {
        if (!value)
             throw new ImmunitetException('Argument can not be empty.', argName);
        let pattern = '^([\\(+.-\\s])?\\(?([\\(+.-\\s])?(\\d{1,4})\\)?([.-\\s])?\\(?(\\d{1,4})([-.\\s])?(\\d{2,4})\\)?([-.\\s])?(\\d{2,4})?([-.\\s])?(\\d{2,4})?([-.\\s])?(\\d{2,7})?$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of Phone number.'], argName);
        return value;
    },

    'time': (value, argument, argName) => {

        return null;
    },

    'date-time': (value, argument, argName) => {

        return null;
    },

    'uri': (value, argument, argName) => {

        return null;
    },

    'hostname': (value, argument, argName) => {

        return null;
    },

    'ipv4': (value, argument, argName) => {

        return null;
    },

    'ipv6': (value, argument, argName) => {

        return null;
    },

    'uuid': (value, argument, argName) => {

        if (!value)
            throw new ImmunitetException(tr['Argument can not be empty.'], argName);
        let pattern = '^([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException(tr['Argument is not type of UUID.'], argName);
        return value;
    },

    'not-empty': (value, argument, argName) => {
        if (value === undefined) {
            throw new ImmunitetException(tr['Argument must not be undefined.'], argName);
        }

        if (value === null) {
            throw new ImmunitetException(tr['Argument must not be null.'], argName);
        }

        if (value!==value) {
            throw new ImmunitetException(tr['Argument must not be NaN.'], argName);
        }

        if (typeof value == 'string' && value === "") {
            throw new ImmunitetException(tr['Argument must not be empty.'], argName);
        }

        return value;

    },

    'json-pointer': (value, argument, argName) => {

        return null;
    },

    'relative-json-pointer': (value, argument, argName) => {

        return null;
    },

    'trim': (value, splitter, argName) => {
        if (typeof value !== 'string')
            throw new ImmunitetException(tr['Argument must be a string.'], argName);

        return value.trim();
    },
};

const PATTERN_PROCESSOR_ALIASES = {};

module.exports = {
    PATTERN_PROCESSORS,
    PATTERN_PROCESSOR_ALIASES,
};
