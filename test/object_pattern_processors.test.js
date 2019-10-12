const { validateFunction, ImmunitetException }  = require('../src/immunitet');
const { processObjectPatterns }                 = require('../src/patternProcessors/object_pattern_processor');
const Chai = require('chai');
const {
    expect,
    assert,
    should,
} = Chai;

describe('check object type pattern processors', function () {
    function add(a, b) {
        return a + b;
    }

    it('is function', function () {
        expect(processObjectPatterns).to.be.a('function');
    });

    it('should properly run if object type argument processor is given', function () {
        let checkAdd = validateFunction(add, {
            "properties": "number",
        });

        let [result, error] = checkAdd("33", 2);
        expect(result).to.equal(35);
    });
});
