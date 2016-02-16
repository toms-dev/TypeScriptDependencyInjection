import DependencyInjector = require('./Injector');

import ProvidedDependency = require('./ProvidedDependency');
import PrototypeProvidedDependency = require('./PrototypeProvidedDependency');
import NamedProvidedDependency = require('./NamedProvidedDependency');

import InjectionRequest = require('./InjectionRequest');

import log4js = require('log4js');
var logger = log4js.getLogger("Context");

/**
 * Data class to hold the link between request and instance
 */
class InjectionRequestInstance {

	request: InjectionRequest;
	instance: ProvidedDependency;

	public constructor(request:InjectionRequest, instance:any) {
		this.request = request;
		this.instance = instance;
	}
}


class DependencyInjectionContext {

	private providedDependencies: ProvidedDependency[];

	private injector:DependencyInjector;

	private requests: InjectionRequestInstance[];

	constructor() {
		this.providedDependencies = [];
		this.injector = new DependencyInjector();
	}

	private loadRequests(dep: ProvidedDependency): void {
		var self = this;
		DependencyInjector.getRequests(dep).map(function(r) {
			self.requests.push(new InjectionRequestInstance(r, dep));
		});
	}

	public addValue(instance:any, name?: string):void {
		if (name) {
			logger.debug("Adding named dep: {}", name);
			this.addNamedValue(instance, name);
			//this.providedDependencies.push(new NamedProvidedDependency(instance, name));
		} else {
			this.providedDependencies.push(new PrototypeProvidedDependency(instance));
		}
	}

	public addNamedValue(instance:any, name:string):void {
		// Store the dependency
		this.providedDependencies.push(new NamedProvidedDependency(instance, name));
	}

	public resolve(strict = false):void {
		// Build the request list
		this.requests = [];
		for (var i in this.providedDependencies) {
			if (! this.providedDependencies.hasOwnProperty(i)) continue;
			var dep = this.providedDependencies[i];
			this.loadRequests(dep);
		}

		// Resolve the requests
		for (var i in this.requests) {
			if (! this.requests.hasOwnProperty(i)) continue;
			var r = this.requests[i];
			this.injector.resolveRequest(r.request, r.instance, this.providedDependencies, strict);
		}
	}

	public resolveStrict(): void {
		this.resolve(true);
	}

}

export = DependencyInjectionContext;
