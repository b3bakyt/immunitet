import im, {
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException
} from '../src/immunitet';
import Chai from 'chai';
const {
    expect,
    assert,
    should,
} = Chai;

describe('check "enum" pattern processor', function () {
    let checkHello = null;
    function hello(val) {
        return 'hello '+ val;
    }

    it('given empty values should return error', function () {
        checkHello = validateFunction(hello, 'enum:one,two');
        let [, error1] = checkHello('');
        expect(error1).not.equal(null);

        let [, error2] = checkHello(NaN);
        expect(error2).not.equal(null);

        let [, error3] = checkHello(null);
        expect(error3).not.equal(null);

        let [, error5] = checkHello(undefined);
        expect(error5).not.equal(null);

        let [, error6] = checkHello(false);
        expect(error6).not.equal(null);
    });

    it('given right String value should return value', function () {
        checkHello = validateValue('enum:one,two');
        let [result] = checkHello('one');
        expect(result).to.equal('one');
    });
});