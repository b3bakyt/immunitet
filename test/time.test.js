const im = require('../src/immunitet');
const {
    validateValue,
    valitimePromise,
    valitimeFunction,
    ImmunitetException,
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;

describe('"time" function', function () {

    it('given wrong value should return error', function () {
        let [,error] = validateValue('time')('44');
        expect(error).not.equal(null);

        [,error] = validateValue('time')(234);
        expect(error).not.equal(null);

        [,error] = validateValue('time')({});
        expect(error).not.equal(null);

        [,error] = validateValue('time')([]);
        expect(error).not.equal(null);

        [,error] = validateValue('time')(true);
        expect(error).not.equal(null);

        [,error] = validateValue('time')('1:12:12');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('12:2:12');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('12:12:1');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('123-123-123');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('28:23:02Z');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('18:23:02Z');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('23:02+20:00');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('T18:23:02');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('20:33:62');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('12:60:22');
        expect(error).not.equal(null);

        [,error] = validateValue('time')('25:60:22');
        expect(error).not.equal(null);
    });

    it('given right value should return same value', function () {
        let [result] = validateValue('time')('23:59:59');
        expect(result).equal('23:59:59');

        [result] = validateValue('time')('12:59:59');
        expect(result).equal('12:59:59');

        [result] = validateValue('time')('12:00:00');
        expect(result).equal('12:00:00');

        [result] = validateValue('time')('00:00:00');
        expect(result).equal('00:00:00');

        [result] = validateValue('time')('01:01:01');
        expect(result).equal('01:01:01');
    });

});
