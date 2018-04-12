
export const STRING_PROCESSORS = {
    'toUpperCase': (value) => {
        return (''+value).toUpperCase();
    },

    'toLowerCase': (value) => {
        return (''+value).toLowerCase();
    },

    'capitalFirst': (value) => {
        return (''+value).replace(/^\w/g, l => l.toUpperCase());
    },

    'capitalFirstLetter': (value) => {
        return (''+value).replace(/\b\w/g, l => l.toUpperCase());
    },
};