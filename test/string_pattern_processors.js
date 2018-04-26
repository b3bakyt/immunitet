import im, {validateFunction, validateValue} from '../src/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('"check" function', function () {
    function add(a, b) {
        return a + b;
    }

    let checkAdd = validateFunction(add);

    it('should properly run if only one argument processor is given', function () {
        checkAdd = validateFunction(add, {
            a: 'number',
        });

        let [result] = checkAdd(33, 2);
        expect(result).to.equal(35);
    });

    it('should properly run if empty argument processor is given', function () {
        checkAdd = validateFunction(add, {});

        let [result1] = checkAdd(5, 2);
        expect(result1).to.equal(7);

        checkAdd = validateFunction(add);
        let [result2] = checkAdd(5, 2);
        expect(result2).to.equal(7);

        checkAdd = validateFunction(add, null);
        let [result3] = checkAdd(5, 2);
        expect(result3).to.equal(7);

        checkAdd = validateFunction(add, undefined);
        let [result4] = checkAdd(5, 2);
        expect(result4).to.equal(7);

        checkAdd = validateFunction(add, []);
        let [result5] = checkAdd(5, 2);
        expect(result5).to.equal(7);
    });

    it('should accept argument processor parameter', function () {
        function addArray(a, b) {
            return a.map((val, key) => val + b[key]);
        }
        checkAdd = validateFunction(addArray, {
            a: 'split:,',
        });

        const [result] = checkAdd('2,3', [3, 4]);
        expect(result).to.deep.equal(['23', '34']);
    });

    it('should process "each" keyword with arguments to parse array values', function () {
        function addArray(a, b) {
            return a.map((val, key) => val + b[key]);
        }
        checkAdd = validateFunction(addArray, {
            a: 'split:,|each:number:convert',
        });

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
});

describe('"validateValue" function', function () {
    let checkAdd = null;

    it('should properly run if only one argument processor is given', function () {
        let checkValue = validateValue({
            a: 'number:convert',
        });

        let [result, error] = checkValue("33");
        expect(result).to.equal(33);
    });

    it('should properly run if multiple argument processors are given', function () {
        let checkValues = validateValue({
            a: 'number:convert',
            b: 'number:round',
            c: 'number:ceil',
            d: 'number:floor',
        });

        let [result2, error2] = checkValues("3.4", 4.4, '3.2', 6.9);
        expect(result2).to.deep.equal([3.4, 4, 4, 6]);
    });

    it('should throw Exception if empty arguments given to validateValue', function () {
        expect(() => validateValue(null)).to.throw(Error);
        expect(() => validateValue(undefined)).to.throw(Error);
        expect(() => validateValue('')).to.throw(Error);
        expect(() => validateValue(0)).to.throw(Error);
        expect(() => validateValue(false)).to.throw(Error);
        expect(() => validateValue(NaN)).to.throw(Error);
        expect(() => validateValue({})).to.throw(Error);
        expect(() => validateValue([])).to.throw(Error);
    });

    it('should process a single value', function () {
        let splitString = validateValue('split:,|each:number:convert');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });

    it('should use a composite processor', function () {
        im.setAlias('toNumericArray', 'split:,|each:number:convert');

        let splitString = validateValue('toNumericArray');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });
});

describe('check "number" pattern processor', function () {
    let checkAdd = null;
    function add(a, b) {
        return a + b;
    }

    it('given empty value "number" processor should return error', function () {
        checkAdd = validateFunction(add, {
            a: 'number',
            b: 'number',
        });
        let [, error1] = checkAdd('', 3);
        expect(error1).not.equal(null);

        let [, error2] = checkAdd(NaN, 3);
        expect(error2).not.equal(null);

        let [, error3] = checkAdd(null, 3);
        expect(error3).not.equal(null);

        let [, error4] = checkAdd(false, 3);
        expect(error4).not.equal(null);

        let [, error5] = checkAdd(undefined, 3);
        expect(error5).not.equal(null);
    });

    it('given a non "number" value should return error', function () {
        checkAdd = validateFunction(add, {
            a: 'number',
            b: 'number',
        });
        let [, error1] = checkAdd("-0x42", 3);
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(Infinity, 2);
        expect(result2).to.equal(null);
        expect(error2).not.equal(null);

        let [result3, error3] = checkAdd(true, 2);
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);

        let [result5, error5] = checkAdd('true', 2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd([], 2);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({}, 2);
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);

        let [result8, error8] = checkAdd('abc', 2);
        expect(result8).to.equal(null);
        expect(error8).not.equal(null);
    });

    it('given a non "number" value and convert should convert argument to number', function () {
        checkAdd = validateFunction(add, {
            a: 'number:convert',
            b: 'number:convert',
        });
        let [result1, error1] = checkAdd('3', 2);
        expect(result1).to.equal(5);

        let [result2, error2] = checkAdd({toString: () => 3}, 2);
        expect(result2).to.equal(5);

        let [result3, error3] = checkAdd({valueOf: () => '3'}, 2);
        expect(result3).to.equal(5);

        let [result4, error4] = checkAdd('-7', 2);
        expect(result4).to.equal(-5);

        let [result5, error5] = checkAdd('abc', 2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd('3-', 2);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({toString: () => 'abc'}, 2);
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);

        let [result8, error8] = checkAdd({valueOf: () => '3ds'}, 2);
        expect(result8).to.equal(null);
        expect(error8).not.equal(null);

        let [result9, error9] = validateValue('number:wrongProcessor')(2);
        expect(result9).to.equal(null);
        expect(error9).not.equal(null);

        let [result10, error10] = checkAdd({toString: () => '4', valueOf: () => '5'}, 2);
        expect(result10).to.equal(7);
    });
});

describe('check "integer" pattern processor', function () {
    let checkAdd = null;
    function add(a, b) {
        return a + b;
    }

    it('given empty values the "integer" processor should return error', function () {
        checkAdd = validateFunction(add, {
            a: 'integer',
            b: 'integer',
        });
        let [, error1] = checkAdd('', 3);
        expect(error1).not.equal(null);

        let [, error2] = checkAdd(NaN, 3);
        expect(error2).not.equal(null);

        let [, error3] = checkAdd(null, 3);
        expect(error3).not.equal(null);

        let [, error4] = checkAdd(false, 3);
        expect(error4).not.equal(null);

        let [, error5] = checkAdd(undefined, 3);
        expect(error5).not.equal(null);
    });

    it('given a non "integer" value should return error', function () {
        checkAdd = validateFunction(add, {
            a: 'integer',
            b: 'integer',
        });
        let [, error1] = checkAdd("-0x42", 3);
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(Infinity, 2);
        expect(result2).to.equal(null);
        expect(error2).not.equal(null);

        let [result3, error3] = checkAdd(true, 2);
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);

        let [result5, error5] = checkAdd('true', 2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd([], 2);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({}, 2);
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);

        let [result8, error8] = checkAdd('abc', 2);
        expect(result8).to.equal(null);
        expect(error8).not.equal(null);
    });

    it('given a non "integer" value and round, floor, ceil processors should convert argument to number', function () {
        checkAdd = validateFunction(add, {
            a: 'integer:round',
            b: 'integer:ceil',
        });
        let [result1, error1] = checkAdd('3', 2);
        expect(result1).to.equal(5);

        let [result2, error2] = checkAdd({toString: () => 3}, 2);
        expect(result2).to.equal(5);

        let [result3, error3] = checkAdd({valueOf: () => '3'}, 2);
        expect(result3).to.equal(5);

        let [result4, error4] = checkAdd('-7', 2);
        expect(result4).to.equal(-5);

        let [result5, error5] = checkAdd('abc', 2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd('3-', 2);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({toString: () => 'abc'}, 2);
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);

        let [result8, error8] = checkAdd({valueOf: () => '3ds'}, 2);
        expect(result8).to.equal(null);
        expect(error8).not.equal(null);

        let [result9, error9] = checkAdd({valueOf: () => '3.3'}, 2);
        expect(result9).to.equal(5);

        let [result10] = checkAdd(3.3, 2.2);
        expect(result10).to.equal(6);

        let [result11] = checkAdd(3.6, 2.6);
        expect(result11).to.equal(7);

        checkAdd = validateFunction(add, {
            a: 'integer:round',
            b: 'integer:floor',
        });

        let [result12] = checkAdd(3.3, 2.2);
        expect(result12).to.equal(5);

        let [result13] = checkAdd(3.6, 2.6);
        expect(result13).to.equal(6);

        let [result14, error14] = validateValue('integer:wrongProcessor')(2);
        expect(result14).to.equal(null);
        expect(error14).not.equal(null);
    });
});

describe('check "minimum" pattern processor', function () {
    let add = (a) => a + 5;

    it('should properly run if "minimum" processor is given', function () {
        let checkAdd = validateFunction(add, {
            a: 'minimum:5',
        });

        let [result] = checkAdd(55);
        expect(result).to.equal(60);

        let [result1] = checkAdd(5);
        expect(result1).to.equal(10);

        let [, error2] = checkAdd(2);
        expect(error2.message).to.equal('The given value is less then 5');

        let [, error3] = checkAdd(0);
        expect(error3.message).to.equal('The given value is less then 5');

        let [, error4] = checkAdd(-2);
        expect(error4.message).to.equal('The given value is less then 5');

        let [result3] = checkAdd('55');
        expect(result3).to.equal(60);

        checkAdd = validateFunction(add, 'minimum:5s');
        let [, error5] = checkAdd(-2);
        expect(error5.message).to.equal('Minimum parameter is not type of number!');

        checkAdd = validateFunction(add, 'minimum:5');
        let [, error6] = checkAdd('as5');
        expect(error6.message).to.equal('Given argument is not type of number!');
    });

    it('should properly run if "maximum" processor is given', function () {
        let checkAdd = validateFunction(add, {
            a: 'maximum:10',
        });

        let [result] = checkAdd(5);
        expect(result).to.equal(10);

        let [result1] = checkAdd(10);
        expect(result1).to.equal(15);

        let [, error2] = checkAdd(12);
        expect(error2.message).to.equal('The given value is greater then 10');

        let [result2] = checkAdd(-2);
        expect(result2).to.equal(3);

        let [result3] = checkAdd('3');
        expect(result3).to.equal(8);

        let [result4] = checkAdd(0);
        expect(result4).to.equal(5);

        checkAdd = validateFunction(add, 'maximum:5s');
        let [, error5] = checkAdd(5);
        expect(error5.message).to.equal('Maximum parameter is not type of number!');

        checkAdd = validateFunction(add, 'maximum:10');
        let [, error6] = checkAdd('as5');
        expect(error6.message).to.equal('Given argument is not type of number!');
    });

    it('should properly run if "minLength" processor is given', function () {
        let checkAdd = validateFunction(add, {
            a: 'minLength:2',
        });

        let [, error] = checkAdd('');
        expect(error.message).to.equal('String minimum length must be 2 symbols!');

        let [, error2] = checkAdd(4);
        expect(error2.message).to.equal('String minimum length must be 2 symbols!');

        let [, error3] = checkAdd(0);
        expect(error3.message).to.equal('String minimum length must be 2 symbols!');

        let [result3] = checkAdd(-1);
        expect(result3).to.equal(4);

        let [result4] = checkAdd('-1');
        expect(result4).to.equal('-15');

        checkAdd = validateFunction(add, 'minLength:2s');
        let [, error5] = checkAdd(5);
        expect(error5.message).to.equal('minLength parameter is not type of number!');

        checkAdd = validateFunction(add, 'minLength:2');
        let [result5] = checkAdd('as5');
        expect(result5).to.equal('as55');
    });

    it('should properly run if "maxLength" processor is given', function () {
        let checkAdd = validateFunction(add, {
            a: 'maxLength:3',
        });

        let [result] = checkAdd('');
        expect(result).to.equal('5');

        let [result1] = checkAdd(4);
        expect(result1).to.equal(9);

        let [result2] = checkAdd(0);
        expect(result2).to.equal(5);

        let [result3] = checkAdd(-1);
        expect(result3).to.equal(4);

        let [result4] = checkAdd('-1');
        expect(result4).to.equal('-15');

        let [result5] = checkAdd(123);
        expect(result5).to.equal(128);

        let [, error] = checkAdd(5321);
        expect(error.message).to.equal('String maximum length must be 3 symbols!');

        checkAdd = validateFunction(add, 'maxLength:2s');
        let [, error5] = checkAdd(5);
        expect(error5.message).to.equal('maxLength parameter is not type of number!');

        checkAdd = validateFunction(add, 'maxLength:3');
        let [result6] = checkAdd('as5');
        expect(result6).to.equal('as55');
    });
});

describe('check "string" pattern processor', function () {
    let checkAdd = null;
    function concat(a, b) {
        return a + b;
    }

    it('given empty values should return error', function () {
        checkAdd = validateFunction(concat, {
            a: 'string',
            b: 'string',
        });
        let [, error1] = checkAdd('', 'hi');
        expect(error1).not.equal(null);

        let [, error2] = checkAdd(NaN, 'hi');
        expect(error2).not.equal(null);

        let [, error3] = checkAdd(null, 'hi');
        expect(error3).not.equal(null);

        let [, error4] = checkAdd(false, 'hi');
        expect(error4).not.equal(null);

        let [, error5] = checkAdd(undefined, 'hi');
        expect(error5).not.equal(null);
    });

    it('given a non "string" value should return error', function () {
        checkAdd = validateFunction(concat, {
            a: 'string',
            b: 'string',
        });
        let [, error1] = checkAdd(22, 'hi');
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(Infinity, 'hi');
        expect(result2).to.equal(null);
        expect(error2).not.equal(null);

        let [result3, error3] = checkAdd(true, 'hi');
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);

        let [result5, error5] = checkAdd(2.2, 'hi');
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd([], 'hi');
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({}, 'hi');
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);
    });

    it('given a processor should change value', function () {
        checkAdd = validateFunction(concat, {
            a: 'string:toLowerCase',
            b: 'string:toUpperCase',
        });
        let [result] = checkAdd('Hi', 'Fi');
        expect(result).equal('hiFI');

        checkAdd = validateFunction(concat, {
            a: 'string:capitalFirst',
            b: 'string:capitalFirstLetter',
        });
        let [result2] = checkAdd('hi fi', ' hello world');
        expect(result2).equal('Hi fi Hello World');

        let [result3, error3] = validateValue('string:wrongProcessor')('hello');
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);
    });
});

describe('check "boolean" pattern processor', function () {
    let checkAdd = null;
    function invert(b) {
        return !b;
    }

    it('given empty values should return error', function () {
        checkAdd = validateFunction(invert, {
            a: 'boolean',
        });
        let [, error1] = checkAdd('');
        expect(error1).not.equal(null);

        let [, error2] = checkAdd(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkAdd(null);
        expect(error3).not.equal(null);

        let [, error4] = checkAdd(0);
        expect(error4).not.equal(null);

        let [, error5] = checkAdd(undefined);
        expect(error5).not.equal(null);
    });

    it('given a non "boolean" value should return error', function () {
        checkAdd = validateFunction(invert, 'boolean');

        let [, error1] = checkAdd(22);
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(Infinity);
        expect(result2).to.equal(null);
        expect(error2).not.equal(null);

        let [result3, error3] = checkAdd('hi');
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);

        let [result5, error5] = checkAdd(2.2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd([]);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({});
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);
    });

    it('given a processor should change value', function () {
        checkAdd = validateFunction(invert, 'boolean:convert');

        let [result] = checkAdd('Hi');
        expect(result).equal(false);

        let [result2] = checkAdd(2);
        expect(result2).equal(false);

        let [result3] = checkAdd(true);
        expect(result3).equal(false);

        let [result4] = checkAdd(2.2);
        expect(result4).equal(false);

        let [result5] = checkAdd({});
        expect(result5).equal(false);

        let [result6] = checkAdd([]);
        expect(result6).equal(false);

        let [result7] = validateValue('boolean:convert')('true');
        expect(result7).equal(true);

        let [result8] = validateValue('boolean:convert')('false');
        expect(result8).equal(false);

        let [result9, error9] = validateValue('boolean:wrongProcessor')(true);
        expect(result9).to.equal(null);
        expect(error9).not.equal(null);

    });
});

describe('check "array" pattern processor', function () {
    let checkAdd = null;
    function invert(b) {
        return !b;
    }

    it('given empty values should return error', function () {
        checkAdd = validateFunction(invert, {
            a: 'array',
        });
        let [, error1] = checkAdd('');
        expect(error1).not.equal(null);

        let [, error2] = checkAdd(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkAdd(null);
        expect(error3).not.equal(null);

        let [, error4] = checkAdd(0);
        expect(error4).not.equal(null);

        let [, error5] = checkAdd(undefined);
        expect(error5).not.equal(null);

        let [, error6] = checkAdd(false);
        expect(error6).not.equal(null);
    });

    it('given a non "array" value should return error', function () {
        checkAdd = validateFunction(invert, 'array');

        let [, error1] = checkAdd(22);
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(Infinity);
        expect(result2).to.equal(null);
        expect(error2).not.equal(null);

        let [result3, error3] = checkAdd('hi');
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);

        let [result5, error5] = checkAdd(2.2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd(false);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd({});
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);

        let [result8, error8] = checkAdd({a: 1, b: 2});
        expect(result8).to.equal(null);
        expect(error8).not.equal(null);
    });

    it('given an Array value should return same value', function () {
        let [result] = validateValue('array')([]);
        expect(result).to.deep.equal([]);

        let [result2] = validateValue('array')([1,2,3]);
        expect(result2).to.deep.equal([1,2,3]);

    });
});

describe('check "object" pattern processor', function () {
    let checkAdd = null;
    function invert(b) {
        return !b;
    }

    it('given empty values should return error', function () {
        checkAdd = validateFunction(invert, {
            a: 'object',
        });
        let [, error1] = checkAdd('');
        expect(error1).not.equal(null);

        let [, error2] = checkAdd(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkAdd(null);
        expect(error3).not.equal(null);

        let [, error4] = checkAdd(0);
        expect(error4).not.equal(null);

        let [, error5] = checkAdd(undefined);
        expect(error5).not.equal(null);

        let [, error6] = checkAdd(false);
        expect(error6).not.equal(null);
    });

    it('given a non "object" value should return error', function () {
        checkAdd = validateFunction(invert, 'object');

        let [, error1] = checkAdd(22);
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(Infinity);
        expect(result2).to.equal(null);
        expect(error2).not.equal(null);

        let [result3, error3] = checkAdd('hi');
        expect(result3).to.equal(null);
        expect(error3).not.equal(null);

        let [result5, error5] = checkAdd(2.2);
        expect(result5).to.equal(null);
        expect(error5).not.equal(null);

        let [result6, error6] = checkAdd(false);
        expect(result6).to.equal(null);
        expect(error6).not.equal(null);

        let [result7, error7] = checkAdd([]);
        expect(result7).to.equal(null);
        expect(error7).not.equal(null);

        let [result8, error8] = checkAdd([1,2,3,44]);
        expect(result8).to.equal(null);
        expect(error8).not.equal(null);
    });

    it('given an Object value should return same value', function () {
        let [result] = validateValue('object')({});
        expect(result).to.deep.equal({});

        let [result2] = validateValue('object')({a: 3, b: 33});
        expect(result2).to.deep.equal({a: 3, b: 33});

    });

    it('given an Object field validators should validate them', function () {
        let [result] = validateValue('object:(a)number:floor||(b)number:ceil')({a: '33', b: '-9'});
        expect(result).to.deep.equal({a: 33, b: -9});

        let [result1] = validateValue('object:number:floor||number:ceil')({a: '33', b: '-9'});
        expect(result1).to.deep.equal({a: 33, b: -9});

        let [result2] = validateValue('object:(a)number:floor||number:ceil')({a: '33', b: '-9'});
        expect(result2).to.deep.equal({a: 33, b: -9});

        let [result3] = validateValue('object:number:floor||(b)number:ceil')({a: '33', b: '-9'});
        expect(result3).to.deep.equal({a: 33, b: -9});

        let [result4, error4] = validateValue('object:(a)number:floor||(c)number:ceil')({a: '33', b: '-9'});
        expect(error4.message).to.equal('No validation processor is specified for an Object property b!');

        let [result5] = validateValue('object:(a)number:floor||(b)number:ceil||(c)function')({a: '33', b: '-9', c: () => {}});
        expect(typeof result5.c).to.equal('function');

        let [,error6] = validateValue('object:(a)number:floor||(b)number:ceil||(c)function')({a: '33', b: '-9', c: []});
        expect(error6.message).to.equal('Given argument is not type of function!');
    });

    it('given an Object field default value should pass them to object properties', function () {
        let [result, error] = validateValue('object:(a)default:5.9|number:floor||(b)default:3.3|number:ceil')({a: undefined, b: undefined});
        expect(result).to.deep.equal({a: 5, b: 4});

    });
});

describe('check "pattern" pattern processor', function () {
    let checkHello = null;
    function hello(val) {
        return 'hello '+ val;
    }

    it('given empty values should return error', function () {
        checkHello = validateFunction(hello, 'pattern');
        let [, error1] = checkHello('');
        expect(error1).not.equal(null);

        let [, error2] = checkHello(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkHello(null);
        expect(error3).not.equal(null);

        let [, error4] = checkHello(0);
        expect(error4).not.equal(null);

        let [, error5] = checkHello(undefined);
        expect(error5).not.equal(null);

        let [, error6] = checkHello(false);
        expect(error6).not.equal(null);
    });

    it('given empty pattern should return error', function () {
        checkHello = validateFunction(hello, 'pattern');
        let [, error] = checkHello('bos');
        expect(error).not.equal(null);

        checkHello = validateFunction(hello, 'pattern:');
        let [, error2] = checkHello('bos');
        expect(error2).not.equal(null);

        checkHello = validateFunction(hello, 'pattern: ');
        let [, error3] = checkHello('bos');
        expect(error3).not.equal(null);
    });

    it('given wrong value should return error', function () {
        checkHello = validateFunction(hello, 'pattern:bob');
        let [, error] = checkHello('bos');
        expect(error).not.equal(null);

        checkHello = validateFunction(hello, 'pattern:[\\d]+');
        let [, error2] = checkHello('hi');
        expect(error2).not.equal(null);

        checkHello = validateFunction(hello, 'pattern:[\\D]+');
        let [, error3] = checkHello(34);
        expect(error3).not.equal(null);

        checkHello = validateFunction(hello, 'pattern:/[\\W]+/i');
        let [, error4] = checkHello('tte3st');
        expect(error4).not.equal(null);

        checkHello = validateFunction(hello, 'pattern:/bob/i|string:toLowerCase');
        let [result5, error5] = checkHello('Bob');
        expect(result5).to.equal('hello bob');
    });

    it('given pattern should should return matched values', function () {
        checkHello = validateFunction(hello, 'pattern:bob');
        let [result] = checkHello('bob');
        expect(result).equal('hello bob');

        checkHello = validateFunction(hello, 'pattern:/bob/i');
        let [result2] = checkHello('Bob');
        expect(result2).equal('hello Bob');

        checkHello = validateFunction(hello, 'pattern:/^[\\w]*$/i');
        let [result3] = checkHello('Obama');
        expect(result3).equal('hello Obama');
    });
});

describe('check "default" pattern processor', function () {

    it('given undefined value should return default value', function () {
        let [result] = validateValue('default:true')();
        expect(result).equal(true);

        let [result2] = validateValue('default:false')();
        expect(result2).equal(false);

        let [result3] = validateValue('default:null')();
        expect(result3).equal(null);

        let [result4] = validateValue('default:11')();
        expect(result4).equal('11');

        let [result5] = validateValue('default:11|number:convert')();
        expect(result5).equal(11);

        let [result6] = validateValue('default:11')(undefined);
        expect(result6).equal('11');
    });

    it('given non undefined value should return the value', function () {
        let [result] = validateValue('default:true')(123);
        expect(result).equal(123);

        let [result2] = validateValue('default:false')('123');
        expect(result2).equal('123');

        let [result3] = validateValue('default:null')(false);
        expect(result3).equal(false);

        let [result4] = validateValue('default:11')('true');
        expect(result4).equal('true');

        let [result5] = validateValue('default:11|number:convert')('34');
        expect(result5).equal(34);

        let [result6] = validateValue('default:11')({a:1});
        expect(result6).to.deep.equal({a:1});

        let [result7] = validateValue('default:11')([2,3]);
        expect(result7).to.deep.equal([2,3]);

        let [result8] = validateValue('default:11')({toString: () => undefined});
        expect(result8).to.be.an('object');

        let [result9] = validateValue('default:11')({valueOf: () => undefined});
        expect(result9).to.be.an('object');
    });
});

describe('check "date" RFC3339 pattern processor', function () {
    let checkDate = null;
    let getDate = date => date;

    it('given empty values should return error', function () {
        checkDate = validateFunction(getDate, 'date');
        let [, error1] = checkDate('');
        expect(error1).not.equal(null);

        let [, error2] = checkDate(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkDate(null);
        expect(error3).not.equal(null);

        let [, error4] = checkDate(0);
        expect(error4).not.equal(null);

        let [, error5] = checkDate(undefined);
        expect(error5).not.equal(null);

        let [, error6] = checkDate(false);
        expect(error6).not.equal(null);
    });

    it('given wrong value should return error', function () {
        let [,error] = validateValue('date')('44');
        expect(error).not.equal(null);

        let [,error2] = validateValue('date')(234);
        expect(error2).not.equal(null);

        let [,error3] = validateValue('date')({});
        expect(error3).not.equal(null);

        let [,error4] = validateValue('date')([]);
        expect(error4).not.equal(null);

        let [,error5] = validateValue('date')(true);
        expect(error5).not.equal(null);

        let [,error6] = validateValue('date')('123-123-123');
        expect(error6).not.equal(null);

        let [,error8] = validateValue('date')('2015-01-17T28:23:02Z');
        expect(error8).not.equal(null);

        let [,error9] = validateValue('date')('2015-02-29T18:23:02Z');
        expect(error9).not.equal(null);

        let [,error10] = validateValue('date')('2015-01-17T18:23:02+20:00');
        expect(error10).not.equal(null);

        let [,error11] = validateValue('date')('2015-01-17T18:23:02Y');
        expect(error11).not.equal(null);

        let [,error12] = validateValue('date')('2015-01-17');
        expect(error12).not.equal(null);

        let [,error13] = validateValue('date')('2015-01-17 20:33:02');
        expect(error13).not.equal(null);

        let [,error14] = validateValue('date')('2015-01-17T20:33:02');
        expect(error14).not.equal(null);

        let [,error15] = validateValue('date')('2015-01-17T20:33:02Y');
        expect(error15).not.equal(null);
    });

    it('given right value should return same value', function () {
        let [result] = validateValue('date')('2015-01-17T01:23:02Z');
        expect(result).not.equal(null);

        let [result1] = validateValue('date')('2015-01-17T18:23:02Z');
        expect(result1).not.equal(null);

        let [result2] = validateValue('date')('2015-01-17T18:23:02+06:45');
        expect(result2).not.equal(null);

        let [result3] = validateValue('date')('2015-01-17T18:23:02-00:00');
        expect(result3).not.equal(null);

        let [result4] = validateValue('date')('2015-03-29T18:23:02+00:00');
        expect(result4).not.equal(null);

        let [result5] = validateValue('date')('2015-01-17T23:23:02Z');
        expect(result5).not.equal(null);
    });

});

describe('check "email" pattern processor', function () {
    let checkDate = null;
    let getEmail = email => email;

    it('given empty values should return error', function () {
        checkDate = validateFunction(getEmail, 'email');
        let [, error1] = checkDate('');
        expect(error1).not.equal(null);

        let [, error2] = checkDate(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkDate(null);
        expect(error3).not.equal(null);

        let [, error4] = checkDate(0);
        expect(error4).not.equal(null);

        let [, error5] = checkDate(undefined);
        expect(error5).not.equal(null);

        let [, error6] = checkDate(false);
        expect(error6).not.equal(null);
    });

    it('given wrong value should return error', function () {
        let [,error] = validateValue('email')('44');
        expect(error).not.equal(null);

        let [,error2] = validateValue('email')(234);
        expect(error2).not.equal(null);

        let [,error3] = validateValue('email')({});
        expect(error3).not.equal(null);

        let [,error4] = validateValue('email')([]);
        expect(error4).not.equal(null);

        let [,error5] = validateValue('email')(true);
        expect(error5).not.equal(null);

        let [,error6] = validateValue('email')('@@');
        expect(error6).not.equal(null);

        let [,error8] = validateValue('email')('@');
        expect(error8).not.equal(null);

        let [,error9] = validateValue('email')('Abc.example.com');
        expect(error9).not.equal(null);

        let [,error10] = validateValue('email')('A@b@c@example.com');
        expect(error10).not.equal(null);

        let [,error11] = validateValue('email')('a"b(c)d,e:f;g<h>i[jk]l@example.com');
        expect(error11).not.equal(null);

        let [,error12] = validateValue('email')('just"not"right@example.com');
        expect(error12).not.equal(null);

        let [,error13] = validateValue('email')('this is"notallowed@example.com');
        expect(error13).not.equal(null);

        let [,error14] = validateValue('email')('this still"not\\allowed@example.com');
        expect(error14).not.equal(null);

        let [,error15] = validateValue('email')('john..doe@example.com');
        expect(error15).not.equal(null);

        let [,error16] = validateValue('email')('john.doe@example..com');
        expect(error16).not.equal(null);
    });

    it('given right value should return value', function () {
        let [result, error] = validateValue('email')('john.doe@example.com');
        expect(result).to.equal('john.doe@example.com');
    });
});