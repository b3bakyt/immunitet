'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isEmpty = exports.isEmpty = function isEmpty(obj) {
    if (!obj) return true;

    if (Array.isArray(obj)) return obj.length === 0;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    if (obj !== obj) return true;

    return JSON.stringify(obj) === JSON.stringify({});
};

var isPromise = exports.isPromise = function isPromise(obj) {
    return !!obj && Object.prototype.toString.call(obj) === '[object Promise]';
};

var hasPromiseValues = exports.hasPromiseValues = function hasPromiseValues(objects, processors) {
    if (isEmpty(objects)) return false;

    var promiseFound = objects.find(function (object, index) {
        return (!processors || processors[index] && processors[index] !== 'promise' || !processors[index]) && isPromise(object);
    });

    return promiseFound !== undefined;
};

var convertToArray = exports.convertToArray = function convertToArray(obj) {
    if (!obj) return [];

    if (typeof obj === 'string') return [obj];

    if (Array.isArray(obj)) {
        return obj;
    }

    return Object.values(obj);
};

var isNumeric = exports.isNumeric = function isNumeric(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return (type === 'number' || type === 'string') && !isNaN(value - parseFloat(value));
};