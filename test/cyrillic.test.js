const {
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;
describe('check "cyrillic" pattern processor on incorrect work', function () {
    let checkCyrillic = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('565666323');
        expect(error.getError().message).to.equal('Argument is not cyrillic letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('asjkfhskdj');
        expect(error.getError().message).to.equal('Argument is not cyrillic letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('аждппппп4');
        expect(error.getError().message).to.equal('Argument is not cyrillic letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('аждпппппcjff');
        expect(error.getError().message).to.equal('Argument is not cyrillic letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('аждпппппc,');
        expect(error.getError().message).to.equal('Argument is not cyrillic letters.');
        expect(result).to.equal(null);
    });
});

describe('check "cyrillic" pattern processor on correct work ', function () {
    let checkCyrillic = null;

    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('Айдай');
        expect(error).to.equal(null);
        expect(result).to.equal('Айдай');
    });

    it('given  value should return successful ', function () {
        checkCyrillic = validateValue('cyrillic');
        let [result, error] = checkCyrillic('Айдай  Айдай');
        expect(error).to.equal(null);
        expect(result).to.equal('Айдай  Айдай');
    });
});
