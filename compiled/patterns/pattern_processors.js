'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.processRegexp = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _exceptions = require('../exceptions');

var REGEXP_FLAGS = {
    'g': 'Global matching',
    'i': 'Ignore case',
    'm': 'Multi line matching'
    // 'y': 'Match after',// :todo
};

var getProcessorNFlag = function getProcessorNFlag(pattern, argNumber) {
    var flag = undefined;

    if (pattern[0] !== '/' || pattern[pattern.length - 1] !== '/' && pattern[pattern.length - 2] !== '/') return [pattern, flag];

    pattern = pattern.substring(1);

    if (pattern[pattern.length - 2] === '/') {
        flag = pattern[pattern.length - 1].toLowerCase();
        flag = REGEXP_FLAGS[flag] ? flag : undefined;
        pattern = pattern.substring(0, pattern.length - 2);
        if (!flag) throw new _exceptions.ImmunitetException('Supplied regexp pattern flag is not supported.', argNumber);

        return [pattern, flag];
    }

    pattern = pattern.substring(0, pattern.length - 1);

    return [pattern, flag];
};

var processRegexp = exports.processRegexp = function processRegexp(value, pattern, argNumber) {
    var _getProcessorNFlag = getProcessorNFlag(pattern, argNumber),
        _getProcessorNFlag2 = _slicedToArray(_getProcessorNFlag, 2),
        cleanPattern = _getProcessorNFlag2[0],
        flag = _getProcessorNFlag2[1];

    var regexp = new RegExp(cleanPattern, flag);
    if (!regexp.test(value)) return false;

    return true;
};