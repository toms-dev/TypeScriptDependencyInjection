/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('./InjectionRequest');
import ProvidedDependency = require('./ProvidedDependency');

class DependencyInjector {

	private injectionRequests: InjectionRequest[];

	// The array of element that may be notified when an injection hook is triggered.
	private injectionListeners: any[];

	constructor() {
		this.injectionRequests = [];
		this.injectionListeners = [];
	}

	public addInjectionRequest(ir): void {
		this.injectionRequests.push(ir);
	}

	public addInjectionListener(il): void {
		console.log("Added injection listener instance:", il.constructor.name);
		this.injectionListeners.push(il);
	}

	public provideWith(target: ProvidedDependency, value: ProvidedDependency): void {
		if (target == undefined || value == undefined) return;

		var proto = Object.getPrototypeOf(target.getInstance());

		var DEP_INJ_REQUESTS_KEY = "dependencyInjection.requests";
		var requests: InjectionRequest[] = Reflect.getMetadata(DEP_INJ_REQUESTS_KEY, proto); //proto.__injectionRequests || [];
		if (! requests) return;
		console.log("Requests of "+proto.constructor.name+":", requests.length);

		// TODO: check if inherited classes work

		for (var i in requests) {
			var r = requests[i];
			// If the requested object prototype name match the value prototype name
			console.log("DEBUG '"+value.getInstance().constructor.name+"' to '" + target.getInstance().constructor.name + "'.");
			if (r.matches(value)) { //valueTypeName == r.kind) {
				console.log("\t>> Providing '"+value.getInstance().constructor.name+"' to '" + target.getInstance().constructor.name + "'.");

				// TODO: check if the dependency is already provided.
				// TODO: throw exception: AmbiguousContext

				// Perform the loading of the value
				r.load(target, value);
				/*r.loadingCallback.apply(target, [value]);*/
			}
		}
	}

	public provideAllWith(target: any[], value): void {
		for (var i in target) {
			var t = target[i];
			this.provideWith(t, value);
		}
	}

	public provideAllDependenciesWith(target: ProvidedDependency[], value: ProvidedDependency): void {
		for (var i in target) {
			var t = target[i];
			this.provideWith(t, value);
		}
	}

	// deprecated
	/*triggerDependencyHook(kind: string, value: any): void {
		console.log("Dependency hook triggered: ", kind);
		for (var i in this.injectionListeners) {
			var obj = this.injectionListeners[i];
			var protoName = obj.constructor.name;
			if (protoName) {
				var requests = this.getInjectionRequestsByPrototypeName(protoName);
				requests = requests.filter(function(req, i) {
					return req.kind == name;
				});
				for (var ri in requests) {
					var r = requests[ri];
					r.loadingCallback(value);
				}
			}
		}
	}*/

	/*getInjectionRequestsByPrototypeName(protoName: string): InjectionRequest[] {
		return this.injectionRequests.filter(function(req, i) {
			return req.prototypeName == protoName;
		});
	}*/

}

export = DependencyInjector;