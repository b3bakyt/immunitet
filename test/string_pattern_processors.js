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

        let [result, error] = checkAdd("33", 2);
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

    it('given a non number value should return error', function () {
        checkAdd = check(add, {
            a: 'number',
            b: 'number',
        });
        let [result1, error1] = checkAdd("-0x42", "");
        expect(error1).not.equal(null);

        let [result2, error2] = checkAdd(NaN, '3');
        expect(error2).not.equal(null);
    });

    it('given a non number value should return null result', function () {
        checkAdd = check(add, {
            a: 'number',
            b: 'number',
        });
        let [result1, error1] = checkAdd(null, true);
        expect(result1).to.equal(null);

        let [result2, error2] = checkAdd(Infinity, undefined);
        expect(result2).to.equal(null);
    });

    it('given a string number should round arguments', function () {
        checkAdd = check(add, {
            a: 'round',
            b: 'round',
        });
        let [result1, error1] = checkAdd('2.2', 3.3);
        expect(result1).to.equal(5);

        let [result2] = checkAdd('2.6', 3.51);
        expect(result2).to.equal(7);
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

    it('should accept process each array values', function () {
        function addArray(a, b) {
            return a.map((val, key) => val + b[key]);
        }
        checkAdd = check(addArray, {
            a: 'split:,|each:number',
        });

        const [result] = checkAdd('2,3', [3, 4]);
        expect(result).to.deep.equal([5, 7]);
    });

    it('should process a single value', function () {
        let splitString = check(null, 'split:,|each:number');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });

    it('should use a composite processor', function () {
        im.setAlias('toNumericArray', 'split:,|each:number');

        let splitString = check(null, 'toNumericArray');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });
});

describe('"checkValue" function', function () {
    let checkAdd = null;

    it('should properly run if only one argument processor is given', function () {
        checkAdd = checkValue({
            a: 'number',
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
        let splitString = checkValue('split:,|each:number');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });

    it('should use a composite processor', function () {
        im.setAlias('toNumericArray', 'split:,|each:number');

        let splitString = checkValue('toNumericArray');

        const [result] = splitString('3,4');
        expect(result).to.deep.equal([3, 4]);
    });
});