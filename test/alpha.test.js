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
describe('check "alpha" pattern processor on incorrect work', function () {
    let checkAlpha = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('565666323a');
        expect(error.message).to.equal('Given value is not type of string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('165415*');
        expect(error.message).to.equal('Given value is not type of string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('  ');
        expect(error.message).to.equal('Given value is not type of string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('kcfjbhkорлосдм  ');
        expect(error.message).to.equal('Given value is not type of string.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkAlpha = validateValue('alpha');
        let [result, error] = checkAlpha('123');
        expect(error.message).to.equal('Given value is not type of string.');
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