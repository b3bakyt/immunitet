
if (typeof Proxy == 'undefined') {
    throw new Error("This browser doesn't support Proxy");
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

let LANG_CODE    = 'eng';
let tr = {
    eng: require(`./eng`),
    ru:  require(`./ru`),
};

let translations = new Proxy(tr, {
    get(target, name, receiver) {
        return target[LANG_CODE][name];
    },
});

const setLanguage = langCode => {
    if (!['eng','ru'].includes(langCode))
        throw new Error('Wrong language code entered. Please choose between: eng, ru');

    LANG_CODE = langCode;
};

module.exports = {
    setLanguage,
    tr: translations,
};
