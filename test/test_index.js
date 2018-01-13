import im, {check, checkPromise, ImmunitetException} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

// The assertion for a promise must be returned.
describe('immunitet.js lib basic tests', function() {
    it('should be type of "object"', () => {
        console.log('typeof im:', typeof im);
        assert.typeOf(im, 'object');
    });

    it('should have "check" function', () => {
        console.log('typeof im:', typeof im);
        assert.typeOf(check, 'function');
    });

});

describe('"check" function tests', function () {
    function add(a, b) {
        return a + b;
    }

    let checkAdd = check(add);

    // beforeEach(function(){
    //     checkAdd = check(add)
    // });

    it('should return a decorated function', function () {
        assert.typeOf(checkAdd, 'function')
    });

    it('should return result typeof array', function () {
        let result = checkAdd(2, 3);
        assert.typeOf(result, 'array')
    });

    it('should fun(2, 3) return [5]', function () {
        let [result, error] = checkAdd(2, 3);
        expect(result).to.equal(5);
    });

    it('should fun(2, 3) return null error', function () {
        let [result, error] = checkAdd(2, 3);
        expect(error).to.equal(null)
    });

    it('should properly run if only one argument processor is given', function () {
        checkAdd = check(add);

        let [result, error] = checkAdd("33", 2);
        expect(result).to.equal('332');
    });

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

    it('may run a custom function as an argument processor', function () {
        checkAdd = check(add, {
            a: (argValue) => Math.ceil(argValue),
            b: (argValue) => Math.floor(argValue),
        });

        let [result1, error1] = checkAdd('2.2', 3.9);
        expect(result1).to.equal(6);
    });

    it('may throw an exception from inside a custom function', function () {
        checkAdd = check(add, {
            a: (argValue) => {
                throw new ImmunitetException('Test exception');
            },
            b: (argValue) => Math.floor(argValue),
        });

        let [result1, error1] = checkAdd('2.2', 3.9);
        expect(error1).not.equal(null);
    });

    it('system exceptions must be handled externally', function () {
        checkAdd = check(add, {
            a: (argValue) => {
                throw new Error('Test exception');
            },
            b: (argValue) => Math.floor(argValue),
        });

        expect(() => checkAdd(2, 3)).to.throw(Error);
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

describe('"check" function promise tests', function () {
    function add(a, b) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(a + b);
            })
        });
    }

    let checkAdd = checkPromise(add);

    it('should return a Promise with array result', function () {
        checkAdd('2', 5)
            .then((result) => {
                expect(result).to.equal('25');
            })
            .catch((error) => console.error('error:', error));
    });

    it('should process arguments', function () {
        checkAdd = checkPromise(add, {
            a: 'number',
            b: 'number',
        });

        checkAdd('2', '5').then(
            (result) => {
                expect(result).to.equal(7);
            })
            .catch((error) => console.error('error:', error));
    });

    it('should process a single argument', function () {
        checkAdd = checkPromise(add, {
            a: 'number',
        });

        checkAdd('2', 5).then(
            (result) => {
                expect(result).to.equal(7);
            })
            .catch((error) => console.error('error:', error));
    });

    it('should process a wrong promise argument', function () {
        checkAdd = checkPromise(add, {
            a: 'number',
        });

        checkAdd('2d+23', 5).then(
            (result) => {
                console.error('result:', result);
            })
            .catch((error) => {
                // console.error('error:', error);
                expect(error).to.not.equal(null);
            });
    });
});