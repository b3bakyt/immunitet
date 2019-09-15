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
describe('check "not-empty" pattern processor on incorrect work.', function () {
    describe('check for whitespaces', function () {
        describe('check on incorrect work', function () {
            let checkNotEmpty = null;

            it('given  value should return error', function () {
                checkNotEmpty = validateValue('not-empty');
                let [result, error] = checkNotEmpty(' ');
                expect(error).to.equal(null);
                expect(result).to.equal(' ');
            });
        });

        describe('check on correct work', function () {
            let checkNotEmpty = null;

            it('given  value should return successful ', function () {
                checkNotEmpty = validateValue('not-empty');
                let [result, error] = checkNotEmpty('Альфа');
                expect(error).to.equal(null);
                expect(result).to.equal('Альфа');
            });
        });
    });

    describe('check for type NaN', function () {
        describe('check on incorrect work', function () {
            let checkNotNaN = null;
            it('given  value should return error', function () {
                checkNotNaN = validateValue('not-empty');
                let [result, error] = checkNotNaN(NaN);
                expect(error.message).to.equal('given value must not be a NaN');
                expect(result).to.equal(null);
            });
        });

        describe('check on correct work', function () {
            let checkNotNaN = null;

            it('given  value should return successful ', function () {
                checkNotNaN = validateValue('not-empty');
                let [result, error] = checkNotNaN(123);
                expect(error).to.equal(null);
                expect(result).to.equal(123);
            });
        });
    });

    describe('check for type null', function () {
        describe('check on incorrect work', function () {
            let checkNotNull = null;
            it('given  value should return error', function () {
                checkNotNull = validateValue('not-empty');
                let [result, error] = checkNotNull(null);
                expect(error.message).to.equal('given value must not be a null');
                expect(result).to.equal(null);
            });
        });

        describe('check on correct work', function () {
            let checkNotNull = null;

            it('given value should return successful ', function () {
                checkNotNull = validateValue('not-empty');
                let [result, error] = checkNotNull(true);
                expect(error).to.equal(null);
                expect(result).to.equal(true);
            });
        });
    });

    describe('check for type undefined', function () {
        describe('check incorrect work', function () {
            let checkNotUndefined = null;

            it('given  value should return error', function () {
                checkNotUndefined = validateValue('not-empty');
                let [result, error] = checkNotUndefined(undefined);
                expect(error.message).to.equal('given value must not be a undefined');
                expect(result).to.equal(null);
            });
        });

        describe('check correct work', function () {
            let checkNotUndefined = null;

            it('given  value should return successful ', function () {
                checkNotUndefined = validateValue('not-empty');
                let [result, error] = checkNotUndefined('123 ');
                expect(error).to.equal(null);
                expect(result).to.equal('123 ');
            });
        });
    });

});
