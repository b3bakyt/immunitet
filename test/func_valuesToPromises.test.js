const {
    valuesToPromises,
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;

describe('"check" valuesToPromises function', function () {

    it('is a function', function () {
        expect(valuesToPromises).to.be.a('function');
    });

    it('should convert array values to Promises', function () {
        let noPromiseValues = [1, 5, 'test', {a:'b'}, [1], false, null, ''];
        let promiseValues = valuesToPromises(noPromiseValues);
        expect(promiseValues.toString()).to.equal('[object Promise],[object Promise],[object Promise],[object Promise],[object Promise],[object Promise],[object Promise],[object Promise]');
    });

    it('should convert array non Promise values to Promises', function () {
        let noPromiseValues = [Promise.resolve(2), 5];
        let promiseValues = valuesToPromises(noPromiseValues);
        expect(promiseValues.toString()).to.equal('[object Promise],[object Promise]');

        noPromiseValues = [2, Promise.resolve(5)];
        promiseValues = valuesToPromises(noPromiseValues);
        expect(promiseValues.toString()).to.equal('[object Promise],[object Promise]');
    });
});
