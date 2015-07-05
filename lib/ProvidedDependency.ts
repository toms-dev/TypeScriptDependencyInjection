
class ProvidedDependency {

	protected instance: any;

	constructor(instance: any) {
		this.instance = instance;
	}

	getInstance(): any {
		return this.instance;
	}

}

export = ProvidedDependency;