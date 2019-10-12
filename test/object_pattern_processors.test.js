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

    it('is function', function () {
        expect(processObjectPatterns).to.be.a('function');
    });

    it('should properly run if object type argument processor is given', function () {
        let checkAdd = validateFunction(add, {
            "a": "number",
            "b": "number",
        });

        let [result, error] = checkAdd({a: 3, b: 2});
        expect(result).to.equal(5);
    });

    it('should properly run if array type arguments are given', function () {
        let checkAdd = validateFunction(add, [["number","number"]]);

        let [result, error] = checkAdd({a: 3, b: 2});
        expect(result).to.equal(5);
    });

    it('should properly validate object arguments', function () {
        const getValidObject = validateValue([["number","number"]]);

        let [result, error] = getValidObject({a: 3, b: 2});
        expect(result.a).to.equal(3);
    });
});
