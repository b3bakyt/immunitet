const im = require('../src/immunitet');
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

describe('"date" function', function () {

    it('given wrong value should return error', function () {
        let [,error] = validateValue('date')('44');
        expect(error).not.equal(null);

        let [,error2] = validateValue('date')(234);
        expect(error2).not.equal(null);

        let [,error3] = validateValue('date')({});
        expect(error3).not.equal(null);

        let [,error4] = validateValue('date')([]);
        expect(error4).not.equal(null);

        let [,error5] = validateValue('date')(true);
        expect(error5).not.equal(null);

        let [,error6] = validateValue('date')('123-123-123');
        expect(error6).not.equal(null);

        let [,error8] = validateValue('date')('2015-01-17T28:23:02Z');
        expect(error8).not.equal(null);

        let [,error9] = validateValue('date')('2015-02-29T18:23:02Z');
        expect(error9).not.equal(null);

        let [,error10] = validateValue('date')('2015-01-17T18:23:02+20:00');
        expect(error10).not.equal(null);

        let [,error11] = validateValue('date')('2015-01-17T18:23:02Y');
        expect(error11).not.equal(null);

        let [,error13] = validateValue('date')('2015-01-17 20:33:02');
        expect(error13).not.equal(null);

        let [,error14] = validateValue('date')('01-17-2015');
        expect(error14).not.equal(null);

        let [,error15] = validateValue('date')('01-2015-17');
        expect(error15).not.equal(null);
    });

    it('given right value should return same value', function () {
        let [result] = validateValue('date')('2015-01-17');
        expect(result).not.equal(null);

        let [result1] = validateValue('date')('1912-01-17');
        expect(result1).not.equal(null);
    });

});
