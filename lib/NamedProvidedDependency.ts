
import ProvidedDependency = require('./ProvidedDependency');

class NamedProvidedDependency extends ProvidedDependency {

	private name: string;

	constructor(instance: any, name: string) {
		super(instance);
		this.name = name;
	}

	getName(): string {
		return this.name;
	}

}

export = NamedProvidedDependency;