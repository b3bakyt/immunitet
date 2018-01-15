import im, {check, ImmunitetException} from '../lib/immunitet';
import {processObjectPatterns} from '../lib/patternProcessors/object_pattern_processor';
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