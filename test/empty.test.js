const {
    validateValue,
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
} = Chai;

describe('check "empty" pattern processor on correct work.', function () {
    describe('check on correct work', function () {
        let checkEmpty = null;

        it('given null value should return null value', function () {
            checkEmpty = validateValue('empty|numeric');
            let [result, error] = checkEmpty(null);
            expect(error).to.equal(null);
            expect(result).to.equal(null);
        });

        it('given undefined value should return undefined value', function () {
            checkEmpty = validateValue('empty|numeric');
            let [result, error] = checkEmpty(undefined);
            expect(error).to.equal(null);
            expect(result).to.equal(undefined);
        });

        it('given empty string value should return empty string', function () {
            checkEmpty = validateValue('empty|string');
            let [result, error] = checkEmpty('');
            expect(error).to.equal(null);
            expect(result).to.equal('');
        });

        it('given false value should return false value', function () {
            checkEmpty = validateValue('empty|boolean');
            let [result, error] = checkEmpty(false);
            expect(error).to.equal(null);
            expect(result).to.equal(false);
        });

        it('given true value should return true value', function () {
            checkEmpty = validateValue('empty|boolean');
            let [result, error] = checkEmpty(true);
            expect(error).to.equal(null);
            expect(result).to.equal(true);
        });

        it('given 0 value should return 0 value', function () {
            checkEmpty = validateValue('empty|string');
            let [result, error] = checkEmpty('0');
            expect(error).to.equal(null);
            expect(result).to.equal('0');
        });

        it('given "0" value should return "0" value', function () {
            checkEmpty = validateValue('empty|numeric');
            let [result, error] = checkEmpty(0);
            expect(error).to.equal(null);
            expect(result).to.equal(0);
        });

        it('given  value should return error', function () {
            checkEmpty = validateValue('default:hi|empty|string');
            let [result, error] = checkEmpty();
            expect(error).to.equal(null);
            expect(result).to.equal('hi');
        });

        it('given NaN value should return error', function () {
            checkEmpty = validateValue('empty|string');
            let [result, error] = checkEmpty(NaN);
            expect(result).to.equal(null);
            expect(error).to.equal(null);
        });
    });

});

describe('check "empty" pattern processor for non correct work.', function () {
    describe('check for incorrect work', function () {
        let checkNotEmpty = null;

        it('given  value should return error', function () {
            checkNotEmpty = validateValue('empty|numeric');
            let [result, error] = checkNotEmpty('test');
            expect(error).to.not.equal(null);
            expect(result).to.equal(null);
        });

        it('given  value should return error', function () {
            checkNotEmpty = validateValue('empty|boolean');
            let [result, error] = checkNotEmpty({});
            expect(error).to.not.equal(null);
            expect(result).to.equal(null);
        });

        it('given  value should return error', function () {
            checkNotEmpty = validateValue('empty|string');
            let [result, error] = checkNotEmpty(10);
            expect(error).to.not.equal(null);
            expect(result).to.equal(null);
        });
    });
});
