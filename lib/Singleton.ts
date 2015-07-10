

class Singleton<T> {

	private static classes: any[] = [];

	private construct: new () => T;
	private instance: T;

	constructor(classConstructor: new () => T) {
		this.construct = classConstructor;
	}

	public get(): T {
		if (! this.instance) {
			this.instance = new (this.construct)();
		}

		return this.instance;
	}

	public static addSingleton(constructor): void {
		if (Singleton.classes.indexOf(constructor) == -1) {
			Singleton.classes.push(new Singleton(constructor));
		}
	}

	public static getSingleton<A>(construct): Singleton<A> {
		var matching = Singleton.classes.filter(function(currentSingleton) {
			return currentSingleton.construct == construct;
		});

		if (matching.length == 0) {
			throw new Error("No such singleton '"+construct.name+"'");
		}
		if (matching.length > 1) {
			throw new Error("Same singleton was declared twice. How is that possible?");
		}

		return matching[0];
	}

}

export = Singleton;