"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImmunitetException = ImmunitetException;
exports.ImmunitetEmptyValueException = ImmunitetEmptyValueException;
function ImmunitetException(message, argNumber) {
    this.message = message;
    this.name = "immunity.js has found an error!";
    this.argNumber = argNumber;
}

function ImmunitetEmptyValueException(arg, argNumber) {
    this.arg = arg;
    this.message = "Let the argument be empty!";
    this.argNumber = argNumber;
}