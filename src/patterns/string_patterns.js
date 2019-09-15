import {PATTERN_FLAGS} from '../constants/processor_flags';
import {ImmunitetException} from '../exceptions';
import {applyStringProcessors, processStringPatterns} from '../patternProcessors/string_pattern_processor';
import {processNumber} from './number_processors';
import {processString} from './string_processors';
import {processBoolean} from './boolean_processors';
import {processRegexp} from "./pattern_processors";
import {processDefaultValue} from "./default_value_processors";

import {
    isEmpty,
    isNumeric,
    isInArray,
} from '../utils';

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

let getPropertyProcessors = function (processorsList, prop, argNumber) {
    if (Object.prototype.toString.call(processorsList) !== '[object Object]')
        return processorsList.shift();

    if (!processorsList[prop])
        throw new ImmunitetException('No validation processor is specified for an Object property ' + prop + '!', argNumber);

    const result = processorsList[prop];
    delete processorsList[prop];
    return result;
};

export const PATTERN_PROCESSORS = {
    'promise': (value, processors, argNumber) => {
        if (!value)
            throw new ImmunitetException('Given argument is not type of promise!', argNumber);

        if (!value.then || typeof value.then !== 'function')
            throw new ImmunitetException('Given argument is not type of promise!', argNumber);

        return value;
    },

    'number': (value, processors, argNumber) => {
        if (value === '')
            throw new ImmunitetException('Given argument is not type of number!', argNumber);

        if (processors)
            value = processNumber(value, processors, argNumber);

        if (typeof value === 'string')
            throw new ImmunitetException('Given argument is not type of number!', argNumber);

        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!', argNumber);

        return value;
    },

    'integer': (value, processors, argNumber) => {
        if (value === '')
            throw new ImmunitetException('Given argument is not type of integer!', argNumber);

        if (processors)
            value = processNumber(value, processors);

        if (typeof value === 'string')
            throw new ImmunitetException('Given argument is not type of integer!', argNumber);

        if (!Number.isInteger(value))
            throw new ImmunitetException('Given argument is not type of integer!', argNumber);

        return value;
    },


    'array': (value, processors, argNumber) => {
        if (!value)
            throw new ImmunitetException('Argument can not be empty.', argNumber);

        if (Object.prototype.toString.call(value) !== '[object Array]')
            throw new ImmunitetException('Given argument is not type of Array!', argNumber);

        return [...value];
    },

    'object': (userObject, processors, argNumber) => {
        if (!userObject)
            throw new ImmunitetException('Argument can not be empty.', argNumber);

        if (Object.prototype.toString.call(userObject) !== '[object Object]')
            throw new ImmunitetException('Given argument is not type of Array!', argNumber);

        if (!processors)
            return {...userObject};

        const processorsList = getProcessorsObject(processors);

        let result, i = 0;
        for (let prop in userObject) {
            i++;
            if (!userObject.hasOwnProperty(prop))
                continue;

            let propProcessors = getPropertyProcessors(processorsList, prop, argNumber + ':' + prop);
            result = processStringPatterns(userObject[prop], propProcessors, argNumber + ':' + prop);

            userObject[prop] = result;
        }

        let processorKeys = Object.keys(processorsList);
        if (processorKeys.length) {
            let firstKey = processorKeys.shift();
            firstKey = isNumeric(firstKey) ? i : firstKey;
            throw new ImmunitetException('Given argument is not type of function!', argNumber + ':' + firstKey);
        }

        return userObject;
    },

    'function': (value, processors, argNumber) => {
        if (!value)
            throw new ImmunitetException('Given argument is not type of function!', argNumber);

        if (typeof value !== 'function')
            throw new ImmunitetException('Given argument is not type of function!', argNumber);

        return value;
    },

    'boolean': (value, processors, argNumber) => {
        if (!value && typeof value !== 'boolean')
            throw new ImmunitetException('Required argument not found.', argNumber);

        if (processors)
            value = processBoolean(value, processors, argNumber);

        if (typeof value !== 'boolean')
            throw new ImmunitetException('Given argument is not type of boolean!', argNumber);

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

    'each': (values, processors, argNumber) => {
        if (isEmpty(values))
            return values;

        if (!processors)
            return values;

        const processorsList = processors.split(',');

        return values.map(value => {
            return applyStringProcessors(value, processorsList, argNumber);
        });
    },

    'enum': (value, processors, argNumber) => {
        let strValue = '' + value;

        if (!strValue
            || (value !== strValue && strValue === 'NaN')
            || (value !== strValue && strValue === 'null')
            || (value !== strValue && strValue === 'undefined')
            || (value !== strValue && strValue === 'false'))
            throw new ImmunitetException('Argument can not be empty.', argNumber);

        let processorsList = '' + processors.split(',');

        if (processorsList.length === 0)
            throw new Error('No enum values was specified!');

        if (!isInArray(value, processorsList))
            throw new ImmunitetException('Supplied value does not match given enum values!', argNumber);

        return value;
    },

    'minimum': (value, minValue, argNumber) => {
        if (!isNumeric(minValue))
            throw new ImmunitetException('Minimum parameter is not type of number!', argNumber);

        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!', argNumber);

        if (typeof value === 'string')
            value = +value;

        minValue = +minValue;

        if (value < minValue)
            throw new ImmunitetException('The given value is less then ' + minValue, argNumber);

        return value;
    },

    'maximum': (value, maxValue, argNumber) => {
        if (!isNumeric(maxValue))
            throw new ImmunitetException('Maximum parameter is not type of number!', argNumber);

        if (!isNumeric(value))
            throw new ImmunitetException('Given argument is not type of number!', argNumber);

        if (typeof value === 'string')
            value = +value;

        maxValue = +maxValue;

        if (value > maxValue)
            throw new ImmunitetException('The given value is greater then ' + maxValue, argNumber);

        return value;
    },

    'minLength': (value, length, argNumber) => {
        if (!isNumeric(length))
            throw new ImmunitetException('minLength parameter is not type of number!', argNumber);

        length = +length;

        if ((value + '').length < length)
            throw new ImmunitetException('String minimum length must be ' + length + ' symbols!', argNumber);

        return value;
    },

    'maxLength': (value, length, argNumber) => {
        if (!isNumeric(length))
            throw new ImmunitetException('maxLength parameter is not type of number!', argNumber);

        length = +length;

        if ((value + '').length > length)
            throw new ImmunitetException('String maximum length must be ' + length + ' symbols!', argNumber);

        return value;
    },

    'pattern': (value, pattern, argNumber) => {
        if (typeof pattern !== 'string')
            throw new ImmunitetException('Given pattern is not type of string.', argNumber);

        pattern = pattern.trim();

        if (!value)
            throw new ImmunitetException('Argument can not be empty.', argNumber);

        if (!pattern)
            throw new ImmunitetException('Pattern can not be empty.', argNumber);

        if (!processRegexp(value, pattern, argNumber))
            throw new ImmunitetException('Supplied value does not match given pattern.', argNumber);

        return value;
    },

    'default': (value, defaultValue, argNumber) => {
        if (typeof defaultValue === 'undefined')
            throw new ImmunitetException('Default value was not specified.', argNumber);

        if (defaultValue && typeof value === 'undefined')
            value = processDefaultValue(value, defaultValue);

        return value;
    },

    'date': (value, format, argNumber) => { // RFC 3339
        if (!value)
            throw new ImmunitetException('Date argument can not be empty.', argNumber);

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
            throw new ImmunitetException('Given value is not type of RFC3339 date.', argNumber);

        return value;
    },

    'email': (value, argument, argNumber) => {// RFC5322
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.', argNumber);

        let pattern = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of RFC5322 email.', argNumber);

        return value;
    },

    'string': (value, processors, argNumber) => {
        if (!value)
            throw new ImmunitetException('Argument can not be empty.', argNumber);

        if (typeof value !== 'string')
            throw new ImmunitetException(' Given argument is not type of string!', argNumber);

        if (processors)
            value = processString(value, processors, argNumber);

        return value;
    },

    'alpha-numeric':(value,argument,argNumber)=>{
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.', argNumber);
        let pattern = '^(\\d|[a-zA-Z]|[\\s])+([\\da-zA-Z\\s?]+)$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of string or number.', argNumber);
        return value;
    },
    'numeric':(value,argument,argNumber)=>{
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.', argNumber);
        let pattern = '([\\d]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of number.', argNumber);
        return value;
    },
//latin and cyrillic
    'alpha':(value,argument,argNumber)=>{
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.', argNumber);
        let pattern = '^([а-яА-ЯёЁa-zA-Z]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of string.', argNumber);
        return value;
    },

    'latin':(value,argument,argNumber)=>{
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.', argNumber);
        let pattern = '^([a-zA-Z]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not latin letters.', argNumber);
        return value;
    },

    'cyrillic':(value,argument,argNumber)=>{
        if (!value)
            throw new ImmunitetException('Email argument can not be empty.', argNumber);
        let pattern = '([а-яА-ЯёЁ]\\s?)+$';
        let regexp=new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not cyrillic letters.', argNumber);
        return value;
    },

    'phone': (value, argument, argNumber) => {
        if (!value)
             throw new ImmunitetException('Phone argument can not be empty.', argNumber);
        let pattern = '^([\\(+.-\\s])?\\(?([\\(+.-\\s])?(\\d{1,4})\\)?([.-\\s])?\\(?(\\d{1,4})([-.\\s])?(\\d{2,4})\\)?([-.\\s])?(\\d{2,4})?([-.\\s])?(\\d{2,4})?([-.\\s])?(\\d{2,7})?$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of Phone number.', argNumber);
        return value;
    },

    'time': (value, argument, argNumber) => {

        return null;
    },

    'date-time': (value, argument, argNumber) => {

        return null;
    },

    'uri': (value, argument, argNumber) => {

        return null;
    },

    'hostname': (value, argument, argNumber) => {

        return null;
    },

    'ipv4': (value, argument, argNumber) => {

        return null;
    },

    'ipv6': (value, argument, argNumber) => {

        return null;
    },

    'uuid': (value, argument, argNumber) => {

        if (!value)
            throw new ImmunitetException('UUID argument can not be empty.', argNumber);
        let pattern = '^([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}$';
        let regexp = new RegExp(pattern);
        if (!regexp.test(value))
            throw new ImmunitetException('Given value is not type of UUID.', argNumber);
        return value;
    },

    'not-empty': (value, argument, argNumber) => {
        if (value === undefined) {
            throw new ImmunitetException('given value must not be undefined', argNumber);
        }

        if (value === null) {
            throw new ImmunitetException('given value must not be null', argNumber);
        }

        if (value!==value) {
            throw new ImmunitetException('given value must not be NaN', argNumber);
        }

        if (typeof value == 'string' && value === "") {
            throw new ImmunitetException('given value must not be empty', argNumber);
        }

        return value;

    },

    'json-pointer': (value, argument, argNumber) => {

        return null;
    },

    'relative-json-pointer': (value, argument, argNumber) => {

        return null;
    },

    'trim': (value, splitter, argNumber) => {
        if (typeof value !== 'string')
            throw new ImmunitetException('Given value must be a string.', argNumber);

        return value.trim();
    },
};

export const PATTERN_PROCESSOR_ALIASES = {};
