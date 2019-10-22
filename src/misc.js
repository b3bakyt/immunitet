const FN_ARGS        = /(^function\s*[^\(]*\(\s*([^\)]*)\)|\(\s*(.*)\s*\)\s*=>.*|\s*(.*)\s*\s*=>.*)/m;
const FN_ARG_SPLIT   = /,/;
const FN_ARG         = /(\s*=.*)$/gi;
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function getFunctionArgs(fn) {
    if (typeof fn !== 'function')
        throw new Error('Argument is not a function!');

    let fnText = fn.toString().replace(STRIP_COMMENTS, '');
    let argDecl = fnText.match(FN_ARGS);
    let funArgs = argDecl[4] || argDecl[2];

    return funArgs
        .split(FN_ARG_SPLIT)
        .map(arg => arg.trim())
        .map(arg => arg.replace(FN_ARG, ''));
}

module.exports = {
    getFunctionArgs,
};
