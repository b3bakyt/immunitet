"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var processFunctionPatterns = exports.processFunctionPatterns = function processFunctionPatterns(argumentValue, processors) {
    return processors.call(null, argumentValue);
};