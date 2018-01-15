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

    it('pluginPatternProcessors func. should return an object', function () {
        const pathToPlugins = './data/pattern_plugins';
        expect(pluginPatternProcessors(pathToPlugins)).to.be.an('object');
    });
});