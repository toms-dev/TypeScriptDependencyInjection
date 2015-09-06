/// <reference path="../typings.d.ts" />

import Deps = require('ts-dependency-injection');
//import Deps = require('../index');

export import Config = Deps.Config;

@Deps.Singleton
export class MySingleton {
	public singletonMethod(): void {
		console.log("Hello!");
	}
}

export class MyClass {

	@Deps.AutoInject(MySingleton)
	public attr: MySingleton;

	public myMethod(): void {
		console.log("This is my method!");
	}

}

@Deps.DirectLoad
export class MyClassWithDirectLoad {

	@Deps.AutoInject(MySingleton)
	public attr: MySingleton; // = null;

	public myMethod(): void {
		console.log("This is another method!");
	}

}
