
export function ImmunitetException(message, argNumber) {
    this.message = message;
    this.name = "immunity.js has found an error!";
    this.argNumber = argNumber;
}