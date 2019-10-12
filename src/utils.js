const { BASE_NON_EMPTY_TYPES } = require('./constants/general');

const isEmpty = (obj) => {
    if (isBaseTypeEmpty(obj))
        return true;

    if (Array.isArray(obj))
        return obj.length === 0;

    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

const isBaseTypeEmpty = (value) => {
    if (value === '')
        return true;

    if (value === null || value === undefined)
        return true;

    if (value !== value)
        return true;

    return false;
};

const isPromise = function (obj) {
    return !!obj
        && Object.prototype.toString.call(obj) === '[object Promise]';
};

const hasPromiseValues = (objects, processors) => {
    if (isEmpty(objects))
        return false;

    let promiseFound = objects.find((object, index) => {
        return (!processors || (processors[index] && processors[index] !== 'promise') || !processors[index])
            && isPromise(object);
    });

    return promiseFound !== undefined;
};

const convertToObject = (value) => {
    if (isBaseTypeEmpty(value))
        return {};

    if (BASE_NON_EMPTY_TYPES.includes(typeof value))
        return {0: value};

    if (Array.isArray(value)) {
        return value;
    }

    return value;
};

const isNumeric = (value) => {
    const type = typeof value;
    return (type === 'number' || type === 'string') &&
        !isNaN(value - parseFloat(value));
};

const isInArray = (value, array) => {
    return array.indexOf(value) > -1;
};

module.exports = {
    isEmpty,
    isBaseTypeEmpty,
    isPromise,
    hasPromiseValues,
    convertToObject,
    isNumeric,
    isInArray,
};
