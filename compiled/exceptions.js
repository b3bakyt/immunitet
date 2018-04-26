"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImmunitetException = ImmunitetException;
function ImmunitetException(message, argNumber) {
    this.message = message;
    this.name = "immunity.js has found an error!";
    this.argNumber = argNumber;
}