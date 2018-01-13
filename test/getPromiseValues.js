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

});