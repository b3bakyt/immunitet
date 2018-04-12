
export const BOOLEAN_PROCESSORS = {
    'convert': (value) => {
        if (value === 'true')
            return true;

        if (value === 'false')
            return false;

        return Boolean(value);
    },
};