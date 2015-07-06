/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('./InjectionRequest');
import ProvidedDependency = require('./ProvidedDependency');

class DependencyInjector {

	public static getRequests(target:ProvidedDependency):InjectionRequest[] {
		console.log("Target:", target.getInstance());
		var instance = target.getInstance();

		// Skip primitive objects
		var typeofInstance = typeof(instance);
		var isPrimitive = typeofInstance == "number" || typeofInstance == "string";
		if (isPrimitive) return [];

		var proto = Object.getPrototypeOf(instance);

		var DEP_INJ_REQUESTS_KEY = "dependencyInjection.requests";
		var requests:InjectionRequest[] = Reflect.getMetadata(DEP_INJ_REQUESTS_KEY, proto); //proto.__injectionRequests || [];
		if (requests) {
			console.log("Requests of " + proto.constructor.name + ":", requests.length);
		}
		return requests ? requests : [];
	}

	public resolveRequest(r:InjectionRequest, providedInstance:ProvidedDependency, deps:ProvidedDependency[],
						  strict:boolean):void {
		var matchingDeps:ProvidedDependency[] = [];
		for (var i in deps) {
			if (!deps.hasOwnProperty(i)) continue;
			var d = deps[i];

			// Skip self-injection
			if (d.getInstance() == providedInstance.getInstance()) continue;

			// Check if the dependency matches the request
			if (r.matches(d)) {
				matchingDeps.push(d);
			}
		}
		console.log(matchingDeps.length + " matching requests for ", providedInstance.getInstance().constructor.name);
		// Throw an error if more than one dependency matches the request, as the context is ambiguous.
		if (matchingDeps.length > 1) {
			throw new Error("Ambiguous context with " + matchingDeps.length + " matching dependencies.");
		}
		// Throw an error or warn if no provided dependency fulfills the request
		else if (matchingDeps.length == 0) {
			var message = r.toString() + " was not resolved.";
			if (strict) {
				throw new Error(message);
			} else {
				console.log("WARN: " + message);
			}
			return;
		}

		var injectedDep = matchingDeps[0];
		r.load(providedInstance, injectedDep);
	}

}

export = DependencyInjector;