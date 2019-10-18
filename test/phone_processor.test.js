const {
    validateValue,
    validatePromise,
    validateFunction,
    ImmunitetException,
} = require('../src/immunitet');

const Chai = require('chai');

const {
    expect,
    assert,
    should,
} = Chai;

describe('check "phone" pattern processor.Error ', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }

    it('given alpha value should return error (+)', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 10+77652030');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error (/)', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 10/77652030');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error (*)', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 1077652*030');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error (=)', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 10=77652030');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error ("(")', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 107765(2030');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error (,)', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 107765,2030');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('abc');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('0555-12-31-23     ');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });

    it('given alpha value should return error', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber(' ');
        expect(error.message).to.equal('Argument is not type of Phone number.');
        expect(result).to.equal(null);
    });
});

describe('check "phone" pattern processor UZ', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }
    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 10 998 70 9949505');
        expect(error).to.equal(null);
        expect(result).to.equal("9 8 10 998 70 9949505");
    });
    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 998 71 4062510');
        expect(error).to.equal(null);
        expect(result).to.equal("+ 998 71 4062510");
    });
    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('998 73 8588869');
        expect(error).to.equal(null);
        expect(result).to.equal("998 73 8588869");
    });
});

describe('check "phone" pattern processor Kitai', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }
    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 86 8033 80');
        expect(error).to.equal(null);
        expect(result).to.equal("+ 86 8033 80");
    });
    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 86 29 3853');
        expect(error).to.equal(null);
        expect(result).to.equal("+ 86 29 3853");
    });
    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 86 991 129');
        expect(error).to.equal(null);
        expect(result).to.equal("+ 86 991 129");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 86 21 9317');
        expect(error).to.equal(null);
        expect(result).to.equal("+ 86 21 9317");
    });

});

describe('check "phone" pattern processor KZ', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 10 77652030');
        expect(error).to.equal(null);
        expect(result).to.equal("9 8 10 77652030");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('8 10 75563409');
        expect(error).to.equal(null);
        expect(result).to.equal("8 10 75563409");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+7 8 10 71626878');
        expect(error).to.equal(null);
        expect(result).to.equal("+7 8 10 71626878");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+9124 4723300');
        expect(error).to.equal(null);
        expect(result).to.equal("+9124 4723300");
    });

});

describe('check "phone" pattern processor RU', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+7 965 000-00-00');
        expect(error).to.equal(null);
        expect(result).to.equal("+7 965 000-00-00");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+7965 568-38-06');
        expect(error).to.equal(null);
        expect(result).to.equal("+7965 568-38-06");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('8965 625-72-87');
        expect(error).to.equal(null);
        expect(result).to.equal("8965 625-72-87");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('9 8 965 300-54-36');
        expect(error).to.equal(null);
        expect(result).to.equal("9 8 965 300-54-36");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('00 7 965 113907');
        expect(error).to.equal(null);
        expect(result).to.equal("00 7 965 113907");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('00 7 965 113907');
        expect(error).to.equal(null);
        expect(result).to.equal("00 7 965 113907");
    });
});

describe('check "phone" pattern processor KG', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('(996)555-123-123');
        expect(error).to.equal(null);
        expect(result).to.equal("(996)555-123-123");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('555-123-123');
        expect(error).to.equal(null);
        expect(result).to.equal("555-123-123");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+(996)555-123-123');
        expect(error).to.equal(null);
        expect(result).to.equal("+(996)555-123-123");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('0555-123-123');
        expect(error).to.equal(null);
        expect(result).to.equal("0555-123-123");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('555-12-31-23');
        expect(error).to.equal(null);
        expect(result).to.equal("555-12-31-23");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('0555123123');
        expect(error).to.equal(null);
        expect(result).to.equal("0555123123");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('0555 12 31 23');
        expect(error).to.equal(null);
        expect(result).to.equal("0555 12 31 23");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('0555-12-31-23');
        expect(error).to.equal(null);
        expect(result).to.equal("0555-12-31-23");
    });
});

describe('check "phone" pattern processor USA', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 1 208 3345464');
        expect(error).to.equal(null);
        expect(result).to.equal("+ 1 208 3345464");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+1 253 7201274');
        expect(error).to.equal(null);
        expect(result).to.equal('+1 253 7201274');
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 1 213 2473392');
        expect(error).to.equal(null);
        expect(result).to.equal('+ 1 213 2473392');
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+ 1 917 7768138');
        expect(error).to.equal(null);
        expect(result).to.equal('+ 1 917 7768138');
    });
});
describe('check "phone" pattern processor Other countries', function () {
    let checkPhoneNumber = null;

    function hello(value) {
        return value;
    }

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+55 11 99999-5555');
        expect(error).to.equal(null);
        expect(result).to.equal("+55 11 99999-5555");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('(+44)0848.9123.456');
        expect(error).to.equal(null);
        expect(result).to.equal("(+44)0848.9123.456");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('123.456.7890');
        expect(error).to.equal(null);
        expect(result).to.equal("123.456.7890");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+593 7 282-3889');
        expect(error).to.equal(null);
        expect(result).to.equal("+593 7 282-3889");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+821012345678');
        expect(error).to.equal(null);
        expect(result).to.equal("+821012345678");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+077-1-23-45-67');
        expect(error).to.equal(null);
        expect(result).to.equal("+077-1-23-45-67");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+55 11 99999-5555');
        expect(error).to.equal(null);
        expect(result).to.equal("+55 11 99999-5555");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('1 (800) 555-1234');
        expect(error).to.equal(null);
        expect(result).to.equal("1 (800) 555-1234");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('(911) 555-1212');
        expect(error).to.equal(null);
        expect(result).to.equal("(911) 555-1212");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('(+230) 5 911 4450');
        expect(error).to.equal(null);
        expect(result).to.equal("(+230) 5 911 4450");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+867 800 555 1234');
        expect(error).to.equal(null);
        expect(result).to.equal("+867 800 555 1234");
    });

    it('given right value should return result', function () {
        checkPhoneNumber = validateValue('phone');
        let [result, error] = checkPhoneNumber('+1.800.555.1234');
        expect(error).to.equal(null);
        expect(result).to.equal("+1.800.555.1234");
    });
});
