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

describe('check UUID pattern', function () {
    let checkUUID = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('565666323a');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('ljsfdgnbljkdxngk');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('');
        expect(error.message).to.equal('UUID argument can not be empty.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID(' ');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('2165845346545');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640-c222-11e8-8455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640-c222-11e8-845f5-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640-c222-11fe8-8455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640-c2a22-11e8-8455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640a-c222-11e8-8455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8ыувпвc3e2640-c222-11e8-8455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640:c222-11e8-8455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640c222-11e88455-8927f64cq466');
        expect(error.message).to.equal('Given value is not type of UUID.');
        expect(result).to.equal(null);
    });
});
describe('check "numeric" pattern processor on correct work ', function () {
    let checkUUID = null;

    function hello(value) {
        return value;
    }

    it('given  value should return successful', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8c3e2640-c222-11e8-8455-8927f64cc466');
        expect(error).to.equal(null);
        expect(result).to.equal('8c3e2640-c222-11e8-8455-8927f64cc466');
    });

    it('given  value should return successful', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('8C3E2640-C222-11E8-8455-8927F64CC466');
        expect(error).to.equal(null);
        expect(result).to.equal('8C3E2640-C222-11E8-8455-8927F64CC466');
    });

    it('given  value should return successful', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('e22448c5-cebd-4593-9697-5f1b92890372');
        expect(error).to.equal(null);
        expect(result).to.equal('e22448c5-cebd-4593-9697-5f1b92890372');
    });

    it('given  value should return successful', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
        expect(error).to.equal(null);
        expect(result).to.equal('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    });

    it('given  value should return successful', function () {
        checkUUID = validateValue('uuid');
        let [result, error] = checkUUID('11111111-4593-4593-9697-111111111111');
        expect(error).to.equal(null);
        expect(result).to.equal('11111111-4593-4593-9697-111111111111');
    });
});