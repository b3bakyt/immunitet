
function ImmunitetException(message, argName) {
    const error = new Error();
    this.message = message;
    this.name = "immunity.js has found an error!";
    this.argName = argName;
}

function ImmunitetExceptions(errors) {
    this.errors = errors;
    this.message = "immunity.js has found an error!";

    this.getErrors = () => {
        return this.errors;
    }
}

function ImmunitetEmptyValueException(arg, argName) {
    this.arg = arg;
    this.message = "Let the argument be empty!";
    this.argName = argName;
}

module.exports = {
    ImmunitetException,
    ImmunitetExceptions,
    ImmunitetEmptyValueException,
};
