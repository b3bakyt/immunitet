const { tr } = require('./languages');

function ImmunitetException(message, argName) {
    this.message = message;
    this.name = tr['Data validation error.'];
    this.argName = argName;
}

function ImmunitetExceptions(errors) {
    this.errors = errors;
    this.message = tr['Data validation error.'];

    this.getErrors = () => {
        return this.errors;
    };

    this.getError = () => {
        return this.errors.shift();
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
