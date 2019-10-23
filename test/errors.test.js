const { validateFunction, validateValue }   = require('../src/immunitet');
const { processObjectPatterns }             = require('../src/patternProcessors/object_pattern_processor');
const Chai = require('chai');
const {
    expect,
    assert,
    should,
} = Chai;

describe('check object type pattern processors', function () {
    function add({a, b}) {
        return a + b;
    }

    it('should return errors as array by default', function () {
        const rule = {
            title: 'string|maxLength:100',
        };
        let validate = validateValue(rule);

        let [result, error] = validate({ status: 1 });
        const errors = error.getErrors();
        expect(Array.isArray(errors)).equal(true);
    });

    it('should return errors as object if isObject arg specified', function () {
        const rule = {
            title: 'string|maxLength:100',
        };
        let validate = validateValue(rule);

        let [result, error] = validate({ status: 1 });
        const errors = error.getErrors(true);
        console.log('errors:', errors);
        expect(errors && Array.isArray(errors)).equal(false);
        expect(errors['status'].argName).equal('status');
    });
});
