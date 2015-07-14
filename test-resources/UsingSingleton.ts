import Deps = require('../index');

export import Config = Deps.Config;

@Deps.Singleton
export class MySingleton {
	public singletonMethod(): void {
		console.log("Hello!");
	}
}

//@Deps.AutoLoad
export class MyClass {

	@Deps.AutoInject(MySingleton)
	public attr: MySingleton; // = null;

	public myMethod(): void {

	}

}

@Deps.DirectLoad
export class MyClassWithDirectLoad {

	@Deps.AutoInject(MySingleton)
	public attr: MySingleton; // = null;

	public myMethod(): void {

	}

}
