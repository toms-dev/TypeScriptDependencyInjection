class InjectionRequest {

	public targetPrototype;
	public valuePrototype;

	public kind: string;
	public prototypeName: string;
	private propertyKey: string;
	public loadingCallback: Function;

	constructor(propertyKey: string, targetPrototype, valuePrototype) {
		if (typeof(targetPrototype) == "function") {
			throw new Error("Should pass the prototype for the target '"+targetPrototype.name+"', not its constructor!");
		}
		if (typeof(valuePrototype) == "function") {
			throw new Error("Should pass the prototype for the value '"+valuePrototype.name+"', not its constructor!");
		}

		this.propertyKey = propertyKey;

		this.targetPrototype = targetPrototype;
		this.valuePrototype = valuePrototype;


		this.loadingCallback = function(value) {
			this[propertyKey] = value;
		}
	}

	public matches(value): boolean {
		return this.valuePrototype.isPrototypeOf(value);
	}
}

export = InjectionRequest;
