const { tr } = require('./languages');

function ImmunitetException(message, argName) {
    this.message = message;
    this.name = tr['Data validation error.'];
    this.argName = argName;
}

function ImmunitetExceptions(errors) {
    this.errors = errors || {};
    this.message = tr['Data validation error.'];

    function* getFirstError(errors) {
        for (let key in errors) {
            yield errors[key];
        }
    }

    const errorGenerator = getFirstError(this.errors);

    this.getErrors = (isObject = false) => {
        if (isObject)
            return this.errors;

        return Object.values(this.errors);
    };

    this.getError = () => {
        return errorGenerator.next().value;
    };
}

function ImmunitetEmptyValueException(arg, argName) {
    this.arg = arg;
    this.message = tr['Let the argument be empty.'];
    this.argName = argName;
}

module.exports = {
    ImmunitetException,
    ImmunitetExceptions,
    ImmunitetEmptyValueException,
};
