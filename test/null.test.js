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

describe('check "null" pattern processor on uncorrect work', function () {
    let checkNotNull = null;
    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkNotNull = validateValue('NULL');
        let [result, error] = checkNotNull(null);
        expect(error.message).to.equal('Given value is not be NULL.');
        expect(result).to.equal(null);
    });
});

describe('check "null" pattern processor on correct work', function () {
    let checkNotNull = null;
    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkNotNull = validateValue('NULL');
        let [result, error] = checkNotNull('123 ');
        expect(error).to.equal(null);
        expect(result).to.equal('123 ');
    });

    it('given  value should return successful ', function () {
        checkNotNull = validateValue('NULL');
        let [result, error] = checkNotNull('asd');
        expect(error).to.equal(null);
        expect(result).to.equal('asd');
    });
});