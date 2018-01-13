import {
    valuesToPromises,
} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('"check" valuesToPromises function', function () {

    it('is a function', function () {
        expect(valuesToPromises).to.be.a('function');
    });
});