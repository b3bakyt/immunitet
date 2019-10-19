const { validateValue }   = require('../src/immunitet');
const Chai = require('chai');
const {
    expect,
} = Chai;

describe('check validateValue function', function () {

    it('validateValue should expect all object fields to be supplied by validators by default', function () {
        const rule = {
            a: 'number',
        };
        let validate = validateValue(rule);

        let [result, error] = validate({a: 1, b: 2});
        expect(error.getErrors().length).equal(1);
    });

    it('validateValue should expect all fields to be supplied by validators by default', function () {
        const rule = {
            a: 'number',
        };
        let validate = validateValue(rule);

        let [result, error] = validate(1, 2, 3);
        expect(error.getErrors().length).equal(2);
    });
});
