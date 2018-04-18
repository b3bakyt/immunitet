# Immunitet.js

Валидатор, конвертатор аргументов функций, промисов и простых переменных

## Установка

```
npm install immunitet.js
```

### Применение

Валидация переменных и значений

```
import {validateValue} from 'immunitet.js';

let checkValue = validateValue({
    a: 'number:convert',
});

let [result, error] = checkValue("33");
// result: 33
```

валидация нескольких значений

```
import {validateValue} from 'immunitet.js';

let checkValue = validateValue({
    a: 'number:convert',
});

let [result, error] = checkValue("33");
// result: [3.4, 4, 4, 6]
```
let checkValues = validateValue({
    a: 'number:convert',
    b: 'number:round',
    c: 'number:ceil',
    d: 'number:floor',
});

let [result2, error2] = checkValues("3.4", 4.4, '3.2', 6.9);


### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
