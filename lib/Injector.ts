/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('./InjectionRequest');

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

	public provideWith(target, value): void {
		if (target == undefined || value == undefined) return;

		var proto = Object.getPrototypeOf(target);
		var DEP_INJ_REQUESTS_KEY = "dependencyInjection.requests";
		var requests = Reflect.getMetadata(DEP_INJ_REQUESTS_KEY, proto); //proto.__injectionRequests || [];
		console.log("Requests of "+proto.constructor.name+":", requests);

		// TODO: check if inherited classes work

		for (var i in requests) {
			var r = requests[i];
			// If the requested object prototype name match the value prototype name
			if (r.matches(value)) { //valueTypeName == r.kind) {
				console.log("\t>> Providing '"+value.constructor.name+"' to '" + target.constructor.name + "'.");

				// Perform the loading of the value
				r.loadingCallback.apply(target, [value]);
			}
		}
	}

	public provideAllWith(target: any[], value): void {
		for (var i in target) {
			var t = target[i];
			this.provideWith(t, value);
		}
	}

	// deprecated
	triggerDependencyHook(kind: string, value: any): void {
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
	}

	getInjectionRequestsByPrototypeName(protoName: string): InjectionRequest[] {
		return this.injectionRequests.filter(function(req, i) {
			return req.prototypeName == protoName;
		});
	}

}

export = DependencyInjector;