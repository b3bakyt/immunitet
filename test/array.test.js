const { validateFunction, validateValue }   = require('../src/immunitet');
const { processObjectPatterns }             = require('../src/patternProcessors/object_pattern_processor');
const Chai = require('chai');
const {
    expect,
    assert,
    should,
} = Chai;

describe('check array object validation', function () {
    function add({a, b}) {
        return a + b;
    }

    it('should validate values in array', function () {
        let validate = validateValue(['string|maxLength:100', 'string|maxLength:100']);

        let [result, error] = validate(['barak', 'obama']);
        console.log('error:', error);
        expect(error).equal(null);
        expect(result.length).equal(2);
    });

    it('should validate values in array if validation object passed', function () {
        let validate = validateValue({a: 'string|maxLength:100', b: 'string|maxLength:100'});

        let [result, error] = validate(['barak', 'obama']);
        console.log('error:', error);
        expect(error).equal(null);
        expect(result.length).equal(2);
    });
});
