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

describe('check "NaN" pattern processor on uncorrect work', function () {
    let checkNotNaN = null;
    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkNotNaN = validateValue('NaN');
        let [result, error] = checkNotNaN(NaN);
        expect(error.message).to.equal('Given value is not be NaN.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkNotNaN = validateValue('NaN');
        let [result, error] = checkNotNaN(0/0);
        expect(error.message).to.equal('Given value is not be NaN.');
        expect(result).to.equal(null);
    });

});

describe('check "NaN" pattern processor on correct work', function () {
    let checkNotNaN = null;
    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkNotNaN = validateValue('NaN');
        let [result, error] = checkNotNaN('123 ');
        expect(error).to.equal(null);
        expect(result).to.equal('123 ');
    });

    it('given  value should return successful ', function () {
        checkNotNaN = validateValue('NaN');
        let [result, error] = checkNotNaN(' asd');
        expect(error).to.equal(null);
        expect(result).to.equal(' asd');
    });

    it('given  value should return successful ', function () {
        checkNotNaN = validateValue('NaN');
        let [result, error] = checkNotNaN('123');
        expect(error).to.equal(null);
        expect(result).to.equal('123');
    });

    it('given  value should return successful ', function () {
        checkNotNaN = validateValue('NaN');
        let [result, error] = checkNotNaN('sedfd');
        expect(error).to.equal(null);
        expect(result).to.equal('sedfd');
    });
});