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

describe('check "numeric" pattern processor on incorrect work', function () {
    let checkNumeric = null;

    function hello(value) {
        return value;
    }

    it('given  value should return error', function () {
        checkNumeric = validateValue('numeric');
        let [result, error] = checkNumeric('565666323a');
        expect(error.getError().message).to.equal('Argument is not type of number.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkNumeric = validateValue('numeric');
        let [result, error] = checkNumeric('165415*');
        expect(error.getError().message).to.equal('Argument is not type of number.');
        expect(result).to.equal(null);
    });

    it('given  value should return error', function () {
        checkNumeric = validateValue('numeric');
        let [result, error] = checkNumeric('  ');
        expect(error.getError().message).to.equal('Argument is not type of number.');
        expect(result).to.equal(null);
    });

});

describe('check "numeric" pattern processor on correct work ', function () {
    let checkNumeric = null;

    function hello(value) {
        return value;
    }

    it('given  value should return successful ', function () {
        checkNumeric = validateValue('numeric');
        let [result, error] = checkNumeric('123 ');
        expect(error).to.equal(null);
        expect(result).to.equal('123 ');
    });

    it('given  value should return successful ', function () {
        checkNumeric = validateValue('numeric');
        let [result, error] = checkNumeric('123');
        expect(error).to.equal(null);
        expect(result).to.equal('123');
    });


});
