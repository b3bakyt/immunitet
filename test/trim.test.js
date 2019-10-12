const {
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException,
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;


describe('check "numeric" pattern processor for correct work ', function () {
    let checkTrimmedValue = null;

    it('should trim whitespaces on the right side', function () {
        checkTrimmedValue = validateValue('string|trim');
        let [result, error] = checkTrimmedValue('hello ');
        expect(error).to.equal(null);
        expect(result).to.equal('hello');
    });

    it('should trim whitespaces on the left side', function () {
        checkTrimmedValue = validateValue('string|trim');
        let [result, error] = checkTrimmedValue(' hello');
        expect(error).to.equal(null);
        expect(result).to.equal('hello');
    });

    it('should trim whitespaces on the both sides', function () {
        checkTrimmedValue = validateValue('string|trim');
        let [result, error] = checkTrimmedValue(' hello ');
        expect(error).to.equal(null);
        expect(result).to.equal('hello');
    });


});

describe('check "trim" pattern processor for incorrect work', function () {
    let checkTrimmedValue = null;

    it('given numeric value should return error', function () {
        checkTrimmedValue = validateValue('trim');
        let [result, error] = checkTrimmedValue(55);
        expect(error.message).to.equal('Given value must be a string.');
        expect(result).to.equal(null);
    });

    it('given null value should return error', function () {
        checkTrimmedValue = validateValue('trim');
        let [result, error] = checkTrimmedValue(null);
        expect(error.message).to.equal('Given value must be a string.');
        expect(result).to.equal(null);
    });

    it('given undefined value should return error', function () {
        checkTrimmedValue = validateValue('trim');
        let [result, error] = checkTrimmedValue(undefined);
        expect(error.message).to.equal('Given value must be a string.');
        expect(result).to.equal(null);
    });

    it('given NaN value should return error', function () {
        checkTrimmedValue = validateValue('trim');
        let [result, error] = checkTrimmedValue(NaN);
        expect(error.message).to.equal('Given value must be a string.');
        expect(result).to.equal(null);
    });

});
