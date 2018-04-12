import im, {check, checkValue} from '../lib/immunitet';
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

    let checkAdd = check(add);

    it('should properly run if only one argument processor is given', function () {
        checkAdd = check(add, {
            a: 'number',
        });

        let [result] = checkAdd(33, 2);
        expect(result).to.equal(35);
    });

    it('should properly run if empty argument processor is given', function () {
        checkAdd = check(add, {});

        let [result1] = checkAdd(5, 2);
        expect(result1).to.equal(7);

        checkAdd = check(add);
        let [result2] = checkAdd(5, 2);
        expect(result2).to.equal(7);

        checkAdd = check(add, null);
        let [result3] = checkAdd(5, 2);
        expect(result3).to.equal(7);

        checkAdd = check(add, undefined);
        let [result4] = checkAdd(5, 2);
        expect(result4).to.equal(7);

        checkAdd = check(add, []);
        let [result5] = checkAdd(5, 2);
        expect(result5).to.equal(7);
    });

    it('should accept argument processor parameter', function () {
        function addArray(a, b) {
            return a.map((val, key) => val + b[key]);
        }
        checkAdd = check(addArray, {
            a: 'split:,',
        });

        const [result] = checkAdd('2,3', [3, 4]);
        expect(result).to.deep.equal(['23', '34']);
    });

    it('should process "each" keyword with arguments to parse array values', function () {
        function addArray(a, b) {
            return a.map((val, key) => val + b[key]);
        }
        checkAdd = check(addArray, {
            a: 'split:,|each:number:convert',
        });

        const [result] = checkAdd('2,3', [3, 4]);
        expect(result).to.deep.equal([5, 7]);
    });

    it('should process a single value', function () {
        let splitString = check(null, 'split:,|each:number:convert');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });

    it('should use a composite processor', function () {
        im.setAlias('toNumericArray', 'split:,|each:number:convert');

        let splitString = check(null, 'toNumericArray');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });
});

describe('"checkValue" function', function () {
    let checkAdd = null;

    it('should properly run if only one argument processor is given', function () {
        checkAdd = checkValue({
            a: 'number:convert',
        });

        let [result, error] = checkAdd("33");
        expect(result).to.equal(33);
    });

    it('should throw Exception if empty arguments given to checkValue', function () {
        expect(() => checkValue(null)).to.throw(Error);
        expect(() => checkValue(undefined)).to.throw(Error);
        expect(() => checkValue('')).to.throw(Error);
        expect(() => checkValue(0)).to.throw(Error);
        expect(() => checkValue(false)).to.throw(Error);
        expect(() => checkValue(NaN)).to.throw(Error);
        expect(() => checkValue({})).to.throw(Error);
        expect(() => checkValue([])).to.throw(Error);
    });

    it('should process a single value', function () {
        let splitString = checkValue('split:,|each:number:convert');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });

    it('should use a composite processor', function () {
        im.setAlias('toNumericArray', 'split:,|each:number:convert');

        let splitString = checkValue('toNumericArray');

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
        checkAdd = check(add, {
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
        checkAdd = check(add, {
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
        checkAdd = check(add, {
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
    });
});

describe('check "integer" pattern processor', function () {
    let checkAdd = null;
    function add(a, b) {
        return a + b;
    }

    it('given empty values the "integer" processor should return error', function () {
        checkAdd = check(add, {
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
        checkAdd = check(add, {
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
        checkAdd = check(add, {
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

        checkAdd = check(add, {
            a: 'integer:round',
            b: 'integer:floor',
        });

        let [result12] = checkAdd(3.3, 2.2);
        expect(result12).to.equal(5);

        let [result13] = checkAdd(3.6, 2.6);
        expect(result13).to.equal(6);
    });
});

describe('check "min" pattern processor', function () {
    let add = (a) => a + 5;

    it('should properly run if "min" processor is given', function () {
        let checkAdd = check(add, {
            a: 'min:5',
        });

        let [result] = checkAdd(55);
        expect(result).to.equal(60);

        let [, error2] = checkAdd(2);
        expect(error2.message).to.equal('The given value is less then 5');

        let [, error3] = checkAdd(0);
        expect(error3.message).to.equal('The given value is less then 5');

        let [, error4] = checkAdd(-2);
        expect(error4.message).to.equal('The given value is less then 5');

        let [result3] = checkAdd('55');
        expect(result3).to.equal(60);

        checkAdd = check(add, 'min:5s');
        let [, error5] = checkAdd(-2);
        expect(error5.message).to.equal('min parameter is not type of number!');

        checkAdd = check(add, 'min:5');
        let [, error6] = checkAdd('as5');
        expect(error6.message).to.equal('Given argument is not type of number!');
    });

    it('should properly run if "max" processor is given', function () {
        let checkAdd = check(add, {
            a: 'max:10',
        });

        let [result] = checkAdd(5);
        expect(result).to.equal(10);

        let [, error2] = checkAdd(12);
        expect(error2.message).to.equal('The given value is greater then 10');

        let [result1] = checkAdd(0);
        expect(result1).to.equal(5);

        let [result2] = checkAdd(-2);
        expect(result2).to.equal(3);

        let [result3] = checkAdd('3');
        expect(result3).to.equal(8);

        checkAdd = check(add, 'max:5s');
        let [, error5] = checkAdd(5);
        expect(error5.message).to.equal('max parameter is not type of number!');

        checkAdd = check(add, 'max:10');
        let [, error6] = checkAdd('as5');
        expect(error6.message).to.equal('Given argument is not type of number!');
    });

    it('should properly run if "minLength" processor is given', function () {
        let checkAdd = check(add, {
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

        checkAdd = check(add, 'minLength:2s');
        let [, error5] = checkAdd(5);
        expect(error5.message).to.equal('minLength parameter is not type of number!');

        checkAdd = check(add, 'minLength:2');
        let [result5] = checkAdd('as5');
        expect(result5).to.equal('as55');
    });

    it('should properly run if "maxLength" processor is given', function () {
        let checkAdd = check(add, {
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

        checkAdd = check(add, 'maxLength:2s');
        let [, error5] = checkAdd(5);
        expect(error5.message).to.equal('maxLength parameter is not type of number!');

        checkAdd = check(add, 'maxLength:3');
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
        checkAdd = check(concat, {
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
        checkAdd = check(concat, {
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
});