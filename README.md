# Nativescript Environments

Plugin for the Nativescript Framework that allows to use certain files againts the current configured environment in the project, supports raw JS, Angular and Vue projects

## Getting Started

You can create as many environments as you want and configure your files for being used in certain environment, for that you need a configuration file that defines your environment and postfix some of your files that will be used in that environment.

### Prerequisites

You first need to create a TOML file named `environments-config.toml` at the root of your project, next fill it with some environments data, like this:

```TOML
# this is the list of environments, 
# as you can see in toml files you can write comments
[[environments]]
name = "staging" # the name of your environment and also the postfix of files
default = true # indicates that this environments is the default used

[[environments]]
name = "production"
default = false
```

The next step is to create the files, for example you can create a `main-view-model.staging.js` and a `main-view-model.production.js` with similar functionalities but different behavior (like a change in some string or number). When you run your project the first time it will create a `main-view-model.js` that will have the code of the the postfixed file with current environment name defined in your TOML file, next you can require the file in code and made changes with LiveSync support.

For Angular projects you must create a `d.ts` for allow the TypeScript CLI compile your code and also indicating a common structure for all the enviromented files, for example:

```TypeScript
// home.component.d.ts
export declare class HomeComponent {

}
```

And next create the enviromented files, one for Staging environment:

```TypeScript
// home.component.staging.ts
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    public message = "I'm in a Production Environment"

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }
}

```

And one for Production Environment:

```TypeScript
// home.component.staging.ts
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    public message = "I'm in an Staging Environment"

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }
}
```

This will create a `home.component.ts` in the same dir with the code of the current environment (in the future this file will be created in the platforms folder for reduce code redundancy)

### Installing

A step by step series of examples that tell you how to get a development env running

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

You can run the test for each framework variant of nativescript as follows, first clone this repository, and run the NPM command as follows:

```bash
git clone 
cd nativescript-environments
npm run demo.android
```


### NativeScript Core

Run the demo for pure JavaScript NativeScript project

```
npm run demo.android
```
Or
```
npm run demo.ios
```

Next you can play changing the environment in the `environments-config.toml` and do some changes in the environmented files `main-view-model.staging.js` or  `main-view-model.production.js` depending of the current environment

### NativeScript Angular

Run the demo for pure JavaScript NativeScript project

```
npm run demo-ng.android
```
Or
```
npm run demo-ng.ios
```

Next you can play changing the environment in the `environments-config.toml` and do some changes in the environmented files `home.component.staging.ts` or  `home.component.production.ts` depending of the current environment

## Built With

* [Chokidar](https://github.com/paulmillr/chokidar) - NodeJS file watcher
* [Nativescript Hooks](https://github.com/NativeScript/nativescript-hook) - Helper module for installing hooks into NativeScript projects
## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Diego Fernando** - *Initial work* - [Darkyelox](https://github.com/darkyelox)


## License

This project is licensed under the Apache 2.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Inpired to create this plugin because the need of using files in diferent environments or configurations (staging, production, tests, etc.).
* Based on [this article](https://blog.davincisoftware.sk/building-a-mobile-nativescript-app) by Martin Mitro.
