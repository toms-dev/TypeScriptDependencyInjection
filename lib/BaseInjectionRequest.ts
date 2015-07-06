import ProvidedDependency = require('./ProvidedDependency');

/**
 * This class represents an injection request based on the prototype.
 * This means that any provided instance that is using the prototype in the request
 * will be matched.
 */
class BaseInjectionRequest {

	protected targetPrototype: Object;
	private propertyKey: string;
	private loadingCallback: Function;

	constructor(propertyKey: string, targetPrototype) {
		if (typeof(targetPrototype) == "function") {
			throw new Error("Should pass the prototype for the target '"+targetPrototype.name+"', not its constructor!");
		}

		this.targetPrototype = targetPrototype;
		this.propertyKey = propertyKey;

		this.loadingCallback = function(value) {
			this[propertyKey] = value;
		}
	}


	public matches(value): boolean {
		throw "Not overriden";
	}

	public load(target: ProvidedDependency, value: ProvidedDependency): void {
		this.loadingCallback.apply(target.getInstance(), [value.getInstance()]);
	}

	public toString(): string {
		// TODO: @Class to add a .getClassName method ?
		var requestClassName = (<any> this.constructor).name;
		var targetClassName = (<any> this.targetPrototype).constructor.name;
		return requestClassName+"@"+targetClassName+"."+this.propertyKey;
	}
}

export = BaseInjectionRequest;
