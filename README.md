# Immunitet.js

Валидатор, конвертатор аргументов функций, промисов и простых переменных

## Установка

```
npm i immunitet.js
```

### Использование библиотеки

#### Валидация переменных и значений

```
import {validateValue} from 'immunitet.js';
 
let getVar = validateValue({
    a: 'number:convert',
});
 
let [result, error] = getVar("-33");
// result: -33
```

валидация нескольких значений

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

#### обработка значений

```
let splitString = validateValue('split:,|each:number:convert');

const [result] = splitString('3,4');
// result: [3, 4]
```

Валидация аргументов функции

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
// error.message: 'The given value is less then 5'
 
let [, error] = checkAdd(5, 12);
// error.message: 'The given value is greater then 10'
```

#### Передача пользовательской функции в качестве обработчика аргумента 

```
checkAdd = validateFunction(add, {
    a: (argValue) => Math.ceil(argValue),
    b: (argValue) => Math.floor(argValue),
});
 
let [result] = checkAdd('2.2', 3.9);
// result: 6
```

#### Обработка исключений

Генерация пользовательских ошибок

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

Исключения типа ImmunitetException выбрасываемые внутри обрабатываемой функции или функции обработчика отлавливаются 
immunitet.js и возвращаются в качестве результата ошибки.

```
add = (a, b) => {
    throw new ImmunitetException('ImmunitetException thrown from inside a user function')
};
 
checkAdd = validateFunction(add);
 
let [, error] = checkAdd(2, 3);
// error.message: 'ImmunitetException thrown from inside a user function'
```

Все остальные исключения должны отлавливаться внутри try ... catch блока

#### Обработка обещаний

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

Обработка исключений типа ImmunitetException в обещаниях

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

Обработка других исключений и ошибок в обещаниях

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

Обработка Reject в обещаниях

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

Обещания в качестве аргументов функции

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

Передача обещаний в качестве аргументов без обработки

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

### Список валидаторов, конвертаторов и обработчиков

##### Валидаторы

* number
    * convert, floor, round, ceil

Пример:
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
* string
    * toUpperCase, toLowerCase, capitalFirst, capitalFirstLetter
* promise
* array
* object

Пример:
```
let getVar = validateValue('object:(a)number:floor,(b)number:ceil');
let [result] = getVar({a: '33', b: '-9'});
// result: {a: 33, b: -9}
 
let getVar = validateValue('object:number:floor,number:ceil,function');
let [result] = getVar({a: '33', b: '-9', c: () => {}});
// result: {a: 33, b: -9, c: () => {}}
```

* minimum
* maximum
* maximum
* minLength
* minLength
* maxLength
* boolean
    * convert
    
Пример:
```
let getVar = validateValue('boolean:convert');
let [result] = getVar('true');
// result: true
```
* pattern
    
Пример:
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
    
Пример:
```
let getVar = validateValue('default:11');
let [result] = getVar();
// result: '11'
 
let getVar = validateValue('default:11|number:convert');
let [result] = getVar();
// result: 11
```

* date (RFC3339)

Пример:
```
let getVar = validateValue('date');
let [result] = getVar('2015-01-17T01:23:02Z');
// result: '2015-01-17T01:23:02Z'
 
let getVar = validateValue('date');
let [result] = getVar('2015-01-17T18:23:02+06:45');
// result: '2015-01-17T18:23:02+06:45'
```

* email (RFC5322)

Пример:
```
let getVar = validateValue('email');
let [result] = getVar('john.doe@example.com');
// result: 'john.doe@example.com'
// result: [2,3,4]
```

#### Обработчики

* split
Пример:
```
let getVar = validateValue('split:,');
let [result] = getVar('1,2,3');
// result: [1,2,3]
```

* each
Пример:
```
let getVar = validateValue('each:number:ceil');
let [result] = getVar('1.4,2.1,3.9');
// result: [2,3,4]
```

#### Ошибки

Содержание ошибок

Пример:

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
// error.message: 'The given value is greater then 10'
// error.argNumber: 1
```