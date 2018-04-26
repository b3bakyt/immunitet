import im, {
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException
} from '../src/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('immunitet.js lib basic tests', function() {
    it('should be type of "object"', () => {
        assert.typeOf(im, 'object');
    });

    it('should have "check" function', () => {
        assert.typeOf(validateFunction, 'function');
    });

    it('should have "validatePromise" function', () => {
        assert.typeOf(validatePromise, 'function');
    });

});

describe('"check" function tests', function () {
    function add(a, b) {
        return a + b;
    }

    let checkAdd = validateFunction(add, 'default:0');

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
        checkAdd = validateFunction(add, 'default:0');

        let [result, error] = checkAdd("33", 2);
        expect(result).to.equal('332');
    });

    it('may run a custom function as an argument processor', function () {
        checkAdd = validateFunction(add, {
            a: (argValue) => Math.ceil(argValue),
            b: (argValue) => Math.floor(argValue),
        });

        let [result1, error1] = checkAdd('2.2', 3.9);
        expect(result1).to.equal(6);
    });

    it('may throw an exception from inside a custom function', function () {
        checkAdd = validateFunction(add, {
            a: (argValue, argNumber) => {
                throw new ImmunitetException('Test exception', argNumber);
            },
            b: (argValue) => Math.floor(argValue),
        });

        let [result1, error1] = checkAdd('2.2', 3.9);
        expect(error1).not.equal(null);
        expect(error1.argNumber).to.equal(0);
    });

    it('should catch ImmunitetException thrown from inside a user function', function () {
        add = (a, b) => {
            throw new ImmunitetException('ImmunitetException thrown from inside a user function')
        };

        checkAdd = validateFunction(add, 'default:0');

        let [result, error] = checkAdd(2, 3);
        expect(error).to.not.equal(null);
    });

    it('should not catch Error exception thrown from inside a user function', function () {
        add = (a, b) => {
            throw new Error('ImmunitetException thrown from inside a user function')
        };

        checkAdd = validateFunction(add, 'default:0');

        expect(() => checkAdd(2, 3)).to.throw(Error);
    });

    it('system exceptions must be handled externally', function () {
        checkAdd = validateFunction(add, {
            a: (argValue) => {
                throw new Error('Test exception');
            },
            b: (argValue) => Math.floor(argValue),
        });

        expect(() => checkAdd(2, 3)).to.throw(Error);
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

    let checkAdd = validatePromise(add, 'default:0');

    it('should return a Promise with normal result', function () {
        checkAdd('2', 5)
            .then((result) => {
                expect(result).to.equal('25');
            })
            .catch((error) => console.error('error:', error));
    });

    it('should process arguments', function () {
        checkAdd = validatePromise(add, {
            a: 'number',
            b: 'number',
        });

        checkAdd('2', '5').then(
            (result) => {
                expect(result).to.equal(null);
            })
            .catch((error) => {
                expect(error.argNumber).to.equal(0);
            });
    });

    it('should process a single argument', function () {
        checkAdd = validatePromise(add, {
            a: 'number',
        });

        checkAdd('2', 5).then(
            (result) => {
                expect(result).to.equal(null);
            })
            .catch((error) => {
                expect(error.argNumber).to.equal(0);
            });
    });

    it('should process a wrong promise argument', function () {
        checkAdd = validatePromise(add, {
            a: 'number',
        });

        checkAdd('2d+23', 5).then(
            (result) => {
                console.error('result:', result);
            })
            .catch((error) => {
                expect(error).to.not.equal(null);
            });
    });

    it('should process ImmunitetException thrown from inside a custom processor callback', function () {
        checkAdd = validatePromise(add, {
            a: (val) => {
                throw new ImmunitetException('Test promise Error!');
            }
        });

        checkAdd(2, 5).then(
            (result) => {
                console.error('result:', result);
            })
            .catch((error) => {
                expect(error).to.not.equal(null);
            });
    });

    it('should process js Error exception thrown from inside a custom callback', function () {
        checkAdd = validatePromise(add, {
            a: (val) => {
                throw new Error('Test promise Error!');
            }
        });

        checkAdd(2, 5).then(
            (result) => {
                console.error('result:', result);
            })
            .catch((error) => {
                expect(error).to.not.equal(null);
            });
    });

    it('should process js Error rejected from inside a user function', function () {
        function add(a, b) {
            return new Promise((res, rej) => {
                setTimeout(() => {
                    rej(new Error('Error rejected from inside a user function!'));
                })
            });
        }

        checkAdd = validatePromise(add, 'default:0');

        checkAdd(2, 5)
            .then((result) => {
                console.log('result:', result);
                expect(result).to.equal(null);
            })
            .catch((error) => {
                expect(error).to.not.equal(null);
            });
    });

    it('should process Error exception thrown from inside a user function', function () {
        function add(a, b) {
            return new Promise((res, rej) => {
                throw new Error('Error thrown from inside a user function!')
            });
        }

        checkAdd = validatePromise(add, 'default:0');

        checkAdd(2, 5)
            .then((result) => {
                console.log('result:', result);
                expect(result).to.equal(null);
            })
            .catch((error) => {
                expect(error).to.not.equal(null);
                expect(error.message).to.equal('Error thrown from inside a user function!');
            });
    });
});

describe('"check" function promise arguments', function () {
    function add(a, b) {
        return a + b;
    }

    let checkAdd = validatePromise(add, 'default:0');

    it('should accept Promise as an argument', function () {
        const a = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(2)
            })
        });
        const b = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(3)
            })
        });

        checkAdd(a, b)
            .then(([result, error]) => {
                expect(result).to.equal(5);
            })
            .catch(([result, error]) => console.error('error:', error));
    });

    it('should pass Promise arguments as it is, if type was specified', function () {
        function addPromises(a, b) {
            const handledResults = Promise.all([a, b].map(promise => promise
                .then(result => result)));

            return handledResults.then(([a, b]) => {
                    return a + b;
                })
        }

        let checkAdd = validatePromise(addPromises, {a:'promise', b:'promise'});

        const a = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(2)
            })
        });
        const b = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(3)
            })
        });

        checkAdd(a, b)
            .then((result) => {
                expect(result).to.equal(5);
            })
            .catch((error) => console.error('error:', error));

        checkAdd(5, 4)
            .then((result) => {
                expect(result).to.equal(null);
            })
            .catch((error) => {
                expect(error.message).to.equal('Given argument is not type of promise!');
            });
    });
});

describe('"check" function "function" arguments', function () {
    function add(a, b) {
        return a() + b();
    }

    let checkAdd = validateFunction(add, 'default:0');

    it('should accept function as an argument', function () {
        const a = () => 2;
        const b = () => 3;

        let [result, error] = checkAdd(a, b);
        expect(result).to.equal(5);
    });
});

describe('"check"  validate functions must accept multiple arguments', function () {

    it('validateValue should accept multiple arguments as validators', function () {
        const a = () => 2;
        let getArgs = validateValue('number', 'string', 'array', 'object', 'function');

        let [result, error] = getArgs(3, 'tst', [1,2], {a:1, b:2}, a);
        expect(result[0]).to.equal(3);
    });

    it('validateValue should return error if no required argument was passed', function () {
        let getArgs = validateValue('number', 'string');

        let [result, error] = getArgs(3);
        expect(error).to.not.equal(null);
    });

    it('validateFunction should return error if no required argument was passed', function () {
        let getArgs = validateFunction((a, b) => a + b, 'number', 'number');

        let [result, error] = getArgs(3);
        expect(error).to.not.equal(null);
    });

    it('validatePromise should return error if no required argument was passed', function () {
        let getArgs = validatePromise((a, b) => a + b, 'number', 'number');

        getArgs(3)
            .then(result => {
                expect(result).to.equal(null);
            })
            .catch(error => {
                expect(error.argNumber).to.equal(1);
            })
    });
});