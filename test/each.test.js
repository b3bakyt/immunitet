const im = require('../src/immunitet');
const {
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException,
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;

describe('"each" function', function () {

    it('should process "each" keyword with arguments to parse array values', function () {
        function addArray(a, b) {
            return a.map((val, key) => val + b[key]);
        }
        checkAdd = validateFunction(addArray, {
            a: 'split:,|each:number:convert',
        }, false);

        const [result] = checkAdd('2,3', [3, 4]);
        expect(result).to.deep.equal([5, 7]);
    });

    it('should process a single value', function () {
        let splitString = validateFunction(null, 'split:,|each:number:convert');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });

    it('should use a composite processor', function () {
        im.setAlias('toNumericArray', 'each:number:ceil');

        let splitString = validateFunction(null, 'toNumericArray');

        const [result] = splitString([3.2, 4.5, 7.9]);
        expect(result).to.deep.equal([4, 5, 8]);
    });

    it('should process "each" field of array', function () {
        let validate = validateValue({
            a: 'each:number:convert',
        }, false);

        const [result] = validate(['3', '4']);
        expect(result).to.deep.equal([3, 4]);
    });

    it('should process "each" field of object', function () {
        let validate = validateValue('each:number:convert');

        const [result] = validate({a: '3', b: '4'});
        expect(result).to.deep.equal({a: 3, b: 4});
    });
});
