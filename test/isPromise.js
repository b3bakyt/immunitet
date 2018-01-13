import {
    isPromise,
} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    should,
} = Chai;

describe('"check" isPromise function', function () {

    it('is a function', function () {
        expect(isPromise).to.be.a('function');
    });

    it('should return false if an argument is a falsy value', function () {
        expect(isPromise(NaN)).to.equal(false);
        expect(isPromise(false)).to.equal(false);
        expect(isPromise(undefined)).to.equal(false);
        expect(isPromise(null)).to.equal(false);
        expect(isPromise(0)).to.equal(false);
        expect(isPromise('')).to.equal(false);
    });

    it('should return false if an argument is not Promise', function () {
        expect(isPromise({})).to.equal(false);
        expect(isPromise(1)).to.equal(false);
        expect(isPromise('Promise')).to.equal(false);
        expect(isPromise({then: () => { console.log('TEST log!!!') }})).to.equal(false);
        expect(isPromise([])).to.equal(false);
        expect(isPromise({toString: () => '[object Promise]'})).to.equal(false);
    });

    it('should return true if an object is Promise', function () {
        let promise = new Promise(() => {}, () => {});

        expect(isPromise(promise)).to.equal(true);
    });
});