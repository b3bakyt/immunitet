const im = require('./compiled/immunitet');

module.exports = {
    validateFunction: im.validateFunction,
    validateValue: im.validateValue,
    validatePromise: im.validatePromise,
    setAlias: im.setAlias,
    ImmunitetException: im.ImmunitetException,
    isPromise: im.isPromise,
    hasPromiseValues: im.hasPromiseValues,
    valuesToPromises: im.valuesToPromises,
    getPromiseValues: im.getPromiseValues,
    pluginPatternProcessors: im.pluginPatternProcessors
};