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

    it('pluginPatternProcessors func. should throw exception if empty value or object is given', function () {
        expect(() => pluginPatternProcessors()).to.throw(Error);
        expect(() => pluginPatternProcessors(null)).to.throw(Error);
        expect(() => pluginPatternProcessors(undefined)).to.throw(Error);
        expect(() => pluginPatternProcessors(false)).to.throw(Error);
        expect(() => pluginPatternProcessors(0)).to.throw(Error);
        expect(() => pluginPatternProcessors('')).to.throw(Error);
        expect(() => pluginPatternProcessors(NaN)).to.throw(Error);
        expect(() => pluginPatternProcessors({})).to.throw(Error);
        expect(() => pluginPatternProcessors([])).to.throw(Error);
    });

    it('pluginPatternProcessors func. should throw an exception if filled array is given', function () {
        let patterns = [1, 'test'];
        expect(() => pluginPatternProcessors(patterns)).to.throw(Error);
    });

    it('should return true if not empty object is given', function () {
        let patterns = {
            'minLength': true,
            'maxLength': true,
        };
        expect(pluginPatternProcessors(patterns)).to.equal(true);
    });

    it('should add custom plugin processors', function () {
        let patterns = {
            'minLength': (value, length) => {

            },
            'maxLength': (value, length) => {

            },
        };

        pluginPatternProcessors(patterns);
        const concatString = (a, b) => a + b;
        const concatWords = check(concatString, ['minLength:3', 'maxLength:10']);
        const [result, error] = concatWords('be', 'my too long sweet best pest sentence');

        expect(error).to.not.equal(null);
    });
});