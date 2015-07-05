
import ProvidedDependency = require('./ProvidedDependency');

interface InjectionRequest {

	matches(value: ProvidedDependency): boolean;
	load(target: ProvidedDependency, value: ProvidedDependency): void;

}

export = InjectionRequest;