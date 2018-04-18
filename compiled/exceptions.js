"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ImmunitetException = ImmunitetException;
function ImmunitetException(message) {
    this.message = message;
    this.name = "immunity.js has found an error!";
}