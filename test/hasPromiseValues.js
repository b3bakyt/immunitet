import {
    hasPromiseValues,
} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('"check" hasPromiseValues function', function () {

    it('is a function', function () {
        expect(hasPromiseValues).to.be.a('function');
    });

    it('should return false if no Promise value was given', function () {
        let noPromiseValues = [1, 'test', {}, null, NaN, false, [], {then: () => {}, catch: () => {}}];
        expect(hasPromiseValues(noPromiseValues)).to.equal(false);
    });
});