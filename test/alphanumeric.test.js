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
describe('check "alphanumeric" pattern processor on incorrect work', function () {
    let checkAlphaNum = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('565666323*');
        expect(error.getError().message).to.equal('Argument is not type of string or number.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('аопичсломиджчваоли');
        expect(error.getError().message).to.equal('Argument is not type of string or number.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('fgjhdfk45()');
        expect(error.getError().message).to.equal('Argument is not type of string or number.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum(':fgjhdfk45');
        expect(error.getError().message).to.equal('Argument is not type of string or number.');
        expect(result).to.equal(null);
    });
});

describe('check "alphanumeric" pattern processor on correct work ', function () {
    let checkAlphaNum = null;

    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('Aidai55');
        expect(error).to.equal(null);
        expect(result).to.equal('Aidai55');
    });

    it('given  value should return successful ', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('Aidai123  Aidai123');
        expect(error).to.equal(null);
        expect(result).to.equal('Aidai123  Aidai123');
    });

    it('given  value should return successful ', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('45645343654');
        expect(error).to.equal(null);
        expect(result).to.equal('45645343654');
    });

    it('given  value should return successful ', function () {
        checkAlphaNum = validateValue('alpha-numeric');
        let [result, error] = checkAlphaNum('dhgsdkljmlskd');
        expect(error).to.equal(null);
        expect(result).to.equal('dhgsdkljmlskd');
    });
});
