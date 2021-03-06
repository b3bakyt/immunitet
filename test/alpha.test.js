const {
    setLanguage,
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException
} = require('../src/immunitet');

setLanguage('eng');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;
describe('check "alpha" pattern processor on incorrect work', function () {
    let checkAlpha = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('565666323a');
        expect(error.getError().message).to.equal('Argument is not type of alpha string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('165415*');
        expect(error.getError().message).to.equal('Argument is not type of alpha string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('  ');
        expect(error.getError().message).to.equal('Argument is not type of alpha string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('kcfjbhkорлосдм  ');
        expect(error.getError().message).to.equal('Argument is not type of alpha string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('123');
        expect(error.getError().message).to.equal('Argument is not type of alpha string.');
        expect(result).to.equal(null);
    });

});

describe('check "numeric" pattern processor on correct work ', function () {
    let checkAlpha = null;

    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('Альфа');
        expect(error).to.equal(null);
        expect(result).to.equal('Альфа');
    });

    it('given  value should return successful ', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('Альфа ');
        expect(error).to.equal(null);
        expect(result).to.equal('Альфа ');
    });

    it('given  value should return successful ', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('Alpha');
        expect(error).to.equal(null);
        expect(result).to.equal('Alpha');
    });

    it('given  value should return successful ', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('Alpha ');
        expect(error).to.equal(null);
        expect(result).to.equal('Alpha ');
    });

    it('given  value should return successful ', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('Альфа Alpha');
        expect(error).to.equal(null);
        expect(result).to.equal('Альфа Alpha');
    });

});
