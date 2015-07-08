import Deps = require('../index');

@Deps.Singleton
export class MySingleton {

	public singletonMethod(): void {

	}

}

@Deps.AutoLoad
export class MyClass {

	@Deps.AutoInject(MySingleton)
	public attr: MySingleton; // = null;

	public myMethod(): void {

	}

}
