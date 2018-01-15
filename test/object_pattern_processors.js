import im, {check, ImmunitetException} from '../lib/immunitet';
import {processObjectPatterns} from '../lib/patternProcessors/object_pattern_processor';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('check object type pattern processors', function () {
    function add(a, b) {
        return a + b;
    }

    it('is function', function () {
        expect(processObjectPatterns).to.be.a('function');
    });

    it('should properly run if object type argument processor is given', function () {
        let checkAdd = check(add, {
            a: {
                type: 'number',
            },
        });

        let [result, error] = checkAdd("33", 2);
        expect(result).to.equal(35);
    });
});