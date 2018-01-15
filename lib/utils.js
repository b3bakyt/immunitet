
export const isEmpty = (obj) => {
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }

    for(let prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
};

export const isPromise = function (obj) {
    return !!obj
        && Object.prototype.toString.call(obj) === '[object Promise]';
};

export const hasPromiseValues = (objects, processors) => {
    if (isEmpty(objects))
        return false;

    let promiseFound = objects.find((object, index) => {
        return (!processors || (processors[index] && processors[index] !== 'promise') || !processors[index])
            && isPromise(object);
    });

    return promiseFound !== undefined;
};

export const convertToArray = (obj) => {
    if (!obj)
        return [];

    if (typeof obj === 'string')
        return [obj];

    if (Array.isArray(obj)) {
        return obj;
    }

    return Object.values(obj);
};

export const isNumeric = (value) => {
    const type = typeof value;
    return (type === 'number' || type === 'string') &&
        !isNaN(value - parseFloat(value));
};