
export const NUMBER_PROCESSORS = {
    'convert': (value) => {
        return Number(value);
    },

    'floor': (value) => {
        return Math.floor(value);
    },

    'round': (value) => {
        return Math.round(value);
    },

    'ceil': (value) => {
        return Math.ceil(value);
    },
};