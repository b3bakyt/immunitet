const {
    setLanguage,
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

setLanguage('eng');

describe('check "translations" for correct work ', function () {

    it('should throw eng errors by default', function () {
        try {
            let noValidFunction = validateFunction('test');
        } catch (error) {
            expect(error.message).to.equal('First argument must be a type of function or null!');
        }
    });

    it('should throw ru errors if such was set', function () {
        setLanguage('ru');
        try {
            let noValidFunction = validateFunction('test');
        } catch (error) {
            expect(error.message).to.equal('Первый аргумен должен быть функцией!');
        }
    });

});
