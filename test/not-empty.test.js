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

describe('check "not-empty" pattern processor on incorrect work', function () {
    let checkNotEmpty = null;


    it('given  value should return error', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty(' ');
        expect(error.message).to.equal('Given value is not be empty.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty('     ');

        expect(error.message).to.equal('Given value is not be empty.');
        expect(result).to.equal(null);
    });
});

describe('check "not-empty"  pattern processor on correct work ', function () {
    let checkNotEmpty = null;


    it('given  value should return successful ', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty('Альфа');
        expect(error).to.equal(null);
        expect(result).to.equal('Альфа');
    });

    it('given  value should return successful ', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty('1');
        expect(error).to.equal(null);
        expect(result).to.equal('1');
    });
    it('given  value should return successful ', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty('/');
        expect(error).to.equal(null);
        expect(result).to.equal('/');
    });
    it('given  value should return successful ', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty('/*-+@@""    ');
        expect(error).to.equal(null);
        expect(result).to.equal('/*-+@@""    ');
    });
    it('given  value should return successful ', function () {
        checkNotEmpty = validateValue('not-empty');
        let [result, error] = checkNotEmpty('xdhbfdhiudhg4654684/*-+=-////,,,,');
        expect(error).to.equal(null);
        expect(result).to.equal('xdhbfdhiudhg4654684/*-+=-////,,,,');
    });
});