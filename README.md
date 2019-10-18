# immunitet.js

### Write pure business logic inside your functions
and let immunitet.js to handle the dirty job.

Find it in [github](https://github.com/b3bakyt/immunitet)

This library is meant to validate, convert: variables, function arguments, promise values

## Installation

```
npm i -S immunitet.js
```

### Usage



#### Variable validation

```
import {validateValue} from 'immunitet.js';
 
let getVar = validateValue({
    a: 'number:convert',
});
 
let [result, error] = getVar("-33");
// result: -33
```

#### Object validation

```
import {validateValue} from 'immunitet.js';
 
let getVar = validateValue({
    a: 'number:convert',
});
 
let [result, error] = getVar({a: -33});
// result: {a: -33}
```

Multiple variables validation

```
import {validateValue} from 'immunitet.js';

let getVars = validateValue({
    a: 'number:convert',
    b: 'number:round',
    c: 'number:ceil',
    d: 'number:floor',
});

let [result2, error2] = getVars("3.4", 4.4, '3.2', 6.9);
// result: [3.4, 4, 4, 6]
```

#### Value processing

```
let splitString = validateValue('split:,|each:number:convert');

const [result] = splitString('3,4');
// result: [3, 4]
```

Function argument validation

```
import {validateFunction} from 'immunitet.js';
 
function add(a, b) {
    return a + b;
}
 
let checkAdd = validateFunction(add, {
    a: 'minimum:5',
    b: 'maximum:10'
});
 
let [result] = checkAdd(5, 3);
// result: 8
 
let [, error] = checkAdd(-2, 7);
// error.message: 'Argument is less then 5'
 
let [, error] = checkAdd(5, 12);
// error.message: 'Argument is greater then 10'
```

#### Custom validators\processors

```
checkAdd = validateFunction(add, {
    a: (argValue) => Math.ceil(argValue),
    b: (argValue) => Math.floor(argValue),
});
 
let [result] = checkAdd('2.2', 3.9);
// result: 6
```

#### Exception handling

Custom exceptions

```
checkAdd = validateFunction(add, {
    a: (argValue) => {
        throw new ImmunitetException('My custom error!');
    },
    b: (argValue) => Math.floor(argValue),
});
 
let [, error] = checkAdd('2.2', 3.9);
// error.message: 'My custom error!' 
```

Exceptions of type ImmunitetException which is was thrown inside a user's functions will be caught by 
immunitet.js and returned as an Error object.

```
add = (a, b) => {
    throw new ImmunitetException('ImmunitetException thrown from inside a user function')
};
 
checkAdd = validateFunction(add);
 
let [, error] = checkAdd(2, 3);
// error.message: 'ImmunitetException thrown from inside a user function'
```

All the other exceptions must be handled by a programmer!

#### Promise argument validation

```
import {validatePromise} from 'immunitet.js';
 
function add(a, b) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(a + b);
        })
    });
}
 
checkAdd = validatePromise(add, {
    a: 'number',
    b: 'number',
});
 
checkAdd('2', 5)
    .then((result) => {
        // result: '7'
    })
    .catch((error) => console.error('error:', error));
```

Handling ImmunitetException inside promises

```
checkAdd = validatePromise(add, {
    a: (val) => {
        throw new ImmunitetException('My promise ImmunitetException!');
    }
});
 
checkAdd(2, 5).then(
    (result) => {
        ...
    })
    .catch((error) => {
        // error.message: 'My promise ImmunitetException!'
    });
```

Handling Exceptions other than ImmunitetException inside promises

```
checkAdd = validatePromise(add, {
    a: (val) => {
        throw new Error('My promise Error!');
    }
});
 
checkAdd(2, 5).then(
    (result) => {
        ...
    })
    .catch((error) => {
        // error.message: 'My promise Error!'
    });
```

Rejects inside promises are handled the same way

```
function add(a, b) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            rej(new Error('Error rejected from inside a user function!'));
        })
    });
}
 
checkAdd = validatePromise(add);
 
checkAdd(2, 5)
    .then((result) => {
        ...
    })
    .catch((error) => {
        // error.message: 'Error rejected from inside a user function!'
    });
```

Using Promises as function arguments.

By default immunitet.js runs promises and passes resolved values as function arguments.

```
function add(a, b) {
    return a + b;
}
 
let checkAdd = validatePromise(add);
 
const a = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    })
});
 
const b = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(3)
    })
});
 
checkAdd(a, b)
    .then(([result, error]) => {
        // result: 5
    })
    .catch(([result, error]) => {
        ...
    });
```

Passing promises as function arguments as is

```
function addPromises(a, b) {
    const handledResults = Promise.all([a, b].map(promise => promise
        .then(result => result)));

    return handledResults.then(([a, b]) => {
            return a + b;
        })
}
 
let checkAdd = validatePromise(addPromises, {a:'promise', b:'promise'});
 
const a = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(2)
    })
});
 
const b = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(3)
    })
});
 
checkAdd(a, b)
    .then((result) => {
        // result: 5
    })
    .catch((error) => {
        ....
    });
```

### List of validators, converters and processors

##### Validators

* number
    * convert, floor, round, ceil

Example:
```
let getVar = validateValue('number:floor');
let [result] = getVar('5.9');
// result: 5
 
let [result, error] = getVar("abc");
// result: null
// error.message: 'Given argument is not type of number!'
 
let [result, error] = getVar({toString: () => 31});
// result: 31
 
let [result, error] = getVar({valueOf: () => 32});
// result: 32
 
let [result, error] = getVar({toString: () => 31, valueOf: () => 32});
// result: 32
```

* integer
    * convert, floor, round, ceil
    * enum
* string
    * toUpperCase, toLowerCase, capitalFirst, capitalFirstLetter
    * enum
* promise
* array
    * each
* object

Example:
``` 
let getVar = validateValue('object:number:floor||default:1|number:ceil||function');
let [result] = getVar({a: '33', b: '-9', c: () => {}});
// result: {a: 33, b: -9, c: () => {}}
 
let getVar = validateValue('object:(a)minimum:10||(b)number:ceil');
let [result, error] = getVar({a: 1, b: '-9'});
// error.argNumber: '0:a'
```

* minimum
* maximum
* maximum
* minLength
* minLength
* maxLength
* boolean
    * convert
    
Example:
```
let getVar = validateValue('boolean:convert');
let [result] = getVar('true');
// result: true
```
* pattern
    
Example:
```
let getVar = validateValue('pattern:[\\d]+');
let [result] = getVar('123');
// result: 123

let getVar = validateValue('pattern:/[\w]+/i');
let [result] = getVar('Test');
// result: Test
```

* default
    * true, false, null
    
Example:
```
let getVar = validateValue('default:11');
let [result] = getVar();
// result: '11'
 
let getVar = validateValue('default:11|number:convert');
let [result] = getVar();
// result: 11
```

* date (RFC3339)

Example:
```
let getVar = validateValue('date');
let [result] = getVar('2015-01-17T01:23:02Z');
// result: '2015-01-17T01:23:02Z'
 
let getVar = validateValue('date');
let [result] = getVar('2015-01-17T18:23:02+06:45');
// result: '2015-01-17T18:23:02+06:45'
```

* email (RFC5322)

Example:
```
let getVar = validateValue('email');
let [result] = getVar('john.doe@example.com');
// result: 'john.doe@example.com'
// result: [2,3,4]
```

#### Processors

* split
Example:
```
let getVar = validateValue('split:,');
let [result] = getVar('1,2,3');
// result: [1,2,3]
```

* each
Example:
```
let getVar = validateValue('each:number:ceil');
let [result] = getVar([1.4, 2.1, 3.9]);
// result: [2,3,4]
```

#### Errors

Example object content

Example:

```
import {validateFunction} from 'immunitet.js';
 
function add(a, b) {
    return a + b;
}
 
let checkAdd = validateFunction(add, {
    a: 'minimum:5',
    b: 'maximum:10'
});
 
let [, error] = checkAdd(5, 12);
// error.message: 'Argument is greater then 10'
// error.argNumber: 1
```

#### Custom aliases
You can create a custom alias for a list of processors

```
import {setAlias} from 'immunitet.js';
 
setAlias('roundArrayVals', 'each:number:ceil');
 
let getVar = validateValue('roundArrayVals');
const [result] = getVar([3.2, 4.5, 7.9]);
// result: [4, 5, 8]
```

#### Custom processor creation

You can create a custom processor using pluginPatternProcessors function

```
let patterns = {
    'minLen': (value, length) => {
        if ((value+'').length < length)
            throw new ImmunitetException('String min length is '+ length + ' symbols!');
    
        return value;
    },
    'maxLen': (value, length) => {
        if ((value+'').length > length)
            throw new ImmunitetException('String max length is '+ length + ' symbols!');
    
        return value;
    },
};
 
pluginPatternProcessors(patterns);
const concatString = (a, b) => a + b;
 
const concatWords = validateFunction(concatString, ['minLen:3', 'maxLen:10']);
const [result, error] = concatWords('be', 'my too long sweet best pest sentence');
// error.message: String min length is 3 symbols!
```
