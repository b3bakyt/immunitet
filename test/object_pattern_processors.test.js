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
        let checkAdd = validateFunction(add, ["number","number"], false);

        let [result, error] = checkAdd({a: 3, b: 2, c: 3});
        expect(result).to.equal(5);
    });

    it('should properly validate object arguments', function () {
        const getValidObject = validateValue(["number","number"]);

        let [result, error] = getValidObject({a: 3, b: 2});
        expect(result.a).to.equal(3);
    });

    it('should properly run if object type argument processor not is given', function () {
        let validate = validateValue({
            id: 'empty|number',
            title: 'string|maxLength:100',
            country_id: 'numeric|maximum:1000',
            status: 'default:1|enum:-1,0,1',
        });

        let [result, error] = validate({ id: null, title: 'Test-Tokyo', country_id: 1, status: 1 });
        expect(Object.keys(result).length).to.equal(4);
    });

    it('should return error if object field validator is not specified', function () {
        const rule = {
            title: 'string|maxLength:100',
            country_id: 'numeric|maximum:1000',
            status: 'default:1|enum:-1,0,1',
        };
        let validate = validateValue(rule);

        let [result, error] = validate({ id: null, title: 'Test-Tokyo', country_id: 1, status: 1, description: 'test' });
        expect(error.getErrors().length).equal(2);
    });

    it('should return data if object field validator is not specified, but strict is set to false', function () {
        const rule = {
            id: 'empty|number|maxLength:100',
            title: 'string|maxLength:100',
            country_id: 'numeric|maximum:1000',
            status: 'default:1|enum:-1,0,1',
        };
        let validate = validateValue(rule, false);

        let [result, error] = validate({ id: null, title: 'Test-Tokyo', country_id: 1, status: 1, description: 'test' });
        expect(Object.values(result).length).equal(5);
    });

    it('should set object field default value with strict set to false', function () {
        const rule = {
            id: 'default:1|number:convert|maxLength:100',
            title: 'string|maxLength:100',
            country_id: 'numeric|maximum:1000',
            status: 'default:1|enum:-1,0,1',
        };
        let validate = validateValue(rule, false);

        let [result, error] = validate({ title: 'Test-Tokyo', country_id: 1, status: 1, description: 'test' });
        expect(Object.values(result).length).equal(5);
        expect(result.id).equal(1);
    });

    it('should set field default value with strict set to false', function () {
        const rule = {
            title: 'string|maxLength:100',
            country_id: 'numeric|maximum:1000',
            status: 'default:1|enum:-1,0,1',
            id: 'default:1|number:convert|maxLength:100',
        };
        let validate = validateValue(rule, false);

        let [result, error] = validate('Test-Tokyo', 1, 1);
        expect(Object.values(result).length).equal(4);
        expect(result[3]).equal(1);
    });

    it('should return error with arg name if validation rule was not set', function () {
        const rule = {
            title: 'string|maxLength:100',
        };
        let validate = validateValue(rule);

        let [result, error] = validate({ status: 1 });
        expect(error.getError().argName).equal('status');
    });
});
