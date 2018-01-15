import im, {check, processObjectPatterns, ImmunitetException} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('check object type pattern processors', function () {

    it('is function', function () {
        expect(processObjectPatterns).to.be.a('function');
    });
});