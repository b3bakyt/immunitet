import {
    hasPromiseValues,
} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('"check" isPromise function', function () {

    it('is a function', function () {
        expect(hasPromiseValues).to.be.a('function');
    });
});