import {
    getPromiseValues,
} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('"check" getPromiseValues function', function () {

    it('is a function', function () {
        expect(getPromiseValues).to.be.a('function');
    });

    it('should resolve array of Promises and get values', function () {
        let mixedValues = [2, Promise.resolve(5)];
        let resolveValues = getPromiseValues(mixedValues);
        resolveValues
            .then(result => {
                expect(result.join(',')).to.equal('2,5');
            })
            .catch(error => {
                console.error('error:', error);
                expect(error).to.equal(null);
            })
    });

});