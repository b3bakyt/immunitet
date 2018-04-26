import {ImmunitetException} from "../exceptions";

const REGEXP_FLAGS = {
    'g': 'Global matching',
    'i': 'Ignore case',
    'm': 'Multi line matching',
    // 'y': 'Match after',// :todo
};

const getProcessorNFlag = (pattern, argNumber) => {
    let flag = undefined;

    if (pattern[0] !== '/' || (pattern[pattern.length - 1] !== '/' && pattern[pattern.length - 2] !== '/'))
        return [pattern, flag];

    pattern = pattern.substring(1);

    if (pattern[pattern.length - 2] === '/') {
        flag = (pattern[pattern.length - 1]).toLowerCase();
        flag = REGEXP_FLAGS[flag] ? flag : undefined;
        pattern = pattern.substring(0, pattern.length - 2);
        if (!flag)
            throw new ImmunitetException('Supplied regexp pattern flag is not supported.', argNumber);

        return [pattern, flag];
    }

    pattern = pattern.substring(0, pattern.length - 1);

    return [pattern, flag];
};

export const processRegexp = (value, pattern, argNumber) => {
    let [cleanPattern, flag] = getProcessorNFlag(pattern, argNumber);

    const regexp = new RegExp(cleanPattern, flag);
    if (!regexp.test(value))
        return false;

    return true;
};