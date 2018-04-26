"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var processFunctionPatterns = exports.processFunctionPatterns = function processFunctionPatterns(argumentValue, processors, argNumber) {
    return processors.call(null, argumentValue, argNumber);
};