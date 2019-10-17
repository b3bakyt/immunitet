const {
    BASE_TYPES,
    BASE_NON_EMPTY_TYPES,
} = require('./constants/general');

function isEmpty(obj) {
    if (isBaseTypeEmpty(obj))
        return true;

    if (Array.isArray(obj))
        return obj.length === 0;

    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function isBaseType(value) {
    return value === null || BASE_TYPES.includes(typeof value);
}

function isBaseTypeEmpty(value) {
    if (value === '')
        return true;

    if (value === null || value === undefined)
        return true;

    if (value !== value)
        return true;

    return false;
}

function isPromise(obj) {
    return !!obj
        && Object.prototype.toString.call(obj) === '[object Promise]';
}

function hasPromiseValues(objects, processors) {
    if (isEmpty(objects))
        return false;

    let promiseFound = objects.find((object, index) => {
        return (!processors || (processors[index] && processors[index] !== 'promise') || !processors[index])
            && isPromise(object);
    });

    return promiseFound !== undefined;
}

function convertToObject(value) {
    if (isBaseTypeEmpty(value))
        return [];

    if (BASE_NON_EMPTY_TYPES.includes(typeof value))
        return [value];

    if (Array.isArray(value)) {
        return value;
    }

    return value;
}

function isNumeric(value) {
    const type = typeof value;
    return (type === 'number' || type === 'string') &&
        !isNaN(value - parseFloat(value));
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function isPlainObject(input){
    return input && !Array.isArray(input) && typeof input === 'object';
}

function isObject(input) {
    return input && typeof input === 'object';
}

module.exports = {
    isEmpty,
    isBaseType,
    isBaseTypeEmpty,
    isObject,
    isPlainObject,
    isPromise,
    hasPromiseValues,
    convertToObject,
    isNumeric,
    isInArray,
};
