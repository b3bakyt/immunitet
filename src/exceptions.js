
function ImmunitetException(message, argName) {
    this.message = message;
    this.name = "immunity.js has found an error!";
    this.argName = argName;
}

function ImmunitetEmptyValueException(arg, argName) {
    this.arg = arg;
    this.message = "Let the argument be empty!";
    this.argName = argName;
}

module.exports = {
    ImmunitetException,
    ImmunitetEmptyValueException,
};
