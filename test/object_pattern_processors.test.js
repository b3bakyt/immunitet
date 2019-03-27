import im, {validateFunction, ImmunitetException, validateValue} from '../src/immunitet';
import {processObjectPatterns} from '../src/patternProcessors/object_pattern_processor';
import Chai from 'chai';
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

    it('given text value should return error', function () {
        const checkNumber = validateValue({a: 'number'});
        let [, error] = checkNumber('test');
        expect(error.message).to.not.equal(null);
    });

    it('given number value should return value', function () {
        const checkNumber = validateValue({a: 'number'});
        let [result] = checkNumber(11);
        expect(result).to.equal(11);
    });

    it('given less number of arguments should return error', function () {
        const addFunc = validateFunction(add, {a: 'number', b: 'number'});
        let [result, error] = addFunc(11);
        expect(error.message).to.equal('Given argument is not type of number!');
        expect(result).to.equal(null);
    });

    it('given less number of arguments should return error', function () {
        const addFunc = validateFunction(add, {a: 'number'});
        let [result, error] = addFunc(11, 4);
        expect(error).to.equal(null);
        expect(result).to.equal(15);
    });

    it('should assign a default value to an undefined properties', function () {
        let [result, error] = validateValue('object:(a)number:floor||(c)default:0|number:ceil')({a: '33'});
        expect(result).to.deep.equal({a: 33, c: 0});
        expect(error).to.equal(null);
    });

    // it('should properly run if object type argument processor is given', function () {
    //     let checkNumber = validateFunction(add, {
    //         a: {
    //             number: "round",
    //             default: 0,
    //         },
    //     });
    //
    //     let [result] = checkNumber(5.3);
    //     expect(result).to.equal(5);
    // });
});