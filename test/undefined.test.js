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

describe('check "undefined" pattern processor on uncorrect work', function () {
    let checkNotUndefined = null;
    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkNotUndefined = validateValue('undefined');
        let [result, error] = checkNotUndefined();
        expect(error.message).to.equal('Given value is not be undefined.');
        expect(result).to.equal(null);
    });
});

describe('check "undefined" pattern processor on correct work', function () {
    let checkNotUndefined = null;
    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkNotUndefined = validateValue('undefined');
        let [result, error] = checkNotUndefined('123 ');
        expect(error).to.equal(null);
        expect(result).to.equal('123 ');
    });

    it('given  value should return successful ', function () {
        checkNotUndefined = validateValue('undefined');
        let [result, error] = checkNotUndefined('asd');
        expect(error).to.equal(null);
        expect(result).to.equal('asd');
    });
});