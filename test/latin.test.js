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
describe('check "latin" pattern processor on incorrect work', function () {
    let checkLatin = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('565666323a');
        expect(error.message).to.equal('Given value is not latin letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('165415*');
        expect(error.message).to.equal('Given value is not latin letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('  ');
        expect(error.message).to.equal('Given value is not latin letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('kcfjbhkорлосдм  ');
        expect(error.message).to.equal('Given value is not latin letters.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('123');
        expect(error.message).to.equal('Given value is not latin letters.');
        expect(result).to.equal(null);
    });
    it('given  value should return error', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('Этонелатынь');
        expect(error.message).to.equal('Given value is not latin letters.');
        expect(result).to.equal(null);
    });

});

describe('check "numeric" pattern processor on correct work ', function () {
    let checkLatin = null;

    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('Alpha');
        expect(error).to.equal(null);
        expect(result).to.equal('Alpha');
    });

    it('given  value should return successful ', function () {
        checkLatin = validateValue('latin');
        let [result, error] = checkLatin('Alpha Alpha');
        expect(error).to.equal(null);
        expect(result).to.equal('Alpha Alpha');
    });

});