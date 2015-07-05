import ProvidedDependency = require('./ProvidedDependency');
import NamedProvidedDependency = require('./NamedProvidedDependency');

import InjectionRequest = require('./InjectionRequest');
import BaseInjectionRequest = require('./BaseInjectionRequest');

/**
 * This class represents an injection request based on the prototype.
 * This means that any provided instance that is using the prototype in the request
 * will be matched.
 */
class NamedInjectionRequest extends BaseInjectionRequest implements InjectionRequest {

	public valueName: string;
	public valuePrototype;

	constructor(propertyKey: string, targetPrototype, name, valuePrototype?) {
		if (valuePrototype && typeof(valuePrototype) == "function") {
			throw new Error("Should pass the prototype for the value '"+valuePrototype.name+"', not its constructor!");
		}

		super(propertyKey, targetPrototype);

		this.valueName = name;
		this.valuePrototype = valuePrototype;
	}

	public matches(value: ProvidedDependency): boolean {
		if (! (value instanceof NamedProvidedDependency)) {
			return false;
		}
		var namedDep = <NamedProvidedDependency> value;

		var nameMatch = this.valueName == namedDep.getName();
		var prototypeMatch = this.valuePrototype ? this.valuePrototype.isPrototypeOf(value.getInstance()) : true;
		// TODO: don't match if the instance is "this" ? -> add a parameter to the method
		return nameMatch && prototypeMatch;
	}
}

export = NamedInjectionRequest;
