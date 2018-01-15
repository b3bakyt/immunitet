import im, {check, pluginPatternProcessors} from '../lib/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('check plugable pattern processors', function () {

    it('pluginPatternProcessors is a function', function () {
        expect(pluginPatternProcessors).to.be.a('function');
    });

    it('pluginPatternProcessors func. should throw exception if empty value\object is given', function () {
        expect(() => pluginPatternProcessors()).to.throw(Error);
    });
});