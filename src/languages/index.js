const { isEmpty } = require('../utils');

let LANG_CODE   = 'eng';
let tr          = {};

const setLanguage = langCode => {
    if (!['eng','ru'].includes(langCode))
        throw new Error('Wrong language code entered. Please choose between: eng, ru');

    LANG_CODE = langCode;

    tr = require(`./${LANG_CODE}`);
};

if (isEmpty(tr))
    tr = require('./eng');


module.exports = {
    setLanguage,
    tr,
};
