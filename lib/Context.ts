import DependencyInjector = require('./Injector');

import ProvidedDependency = require('./ProvidedDependency');
import PrototypeProvidedDependency = require('./PrototypeProvidedDependency');
import NamedProvidedDependency = require('./NamedProvidedDependency');

import InjectionRequest = require('./InjectionRequest');

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
		this.requests = [];
	}

	private addToRequestList(dep: ProvidedDependency): void {
		var self = this;
		DependencyInjector.getRequests(dep).map(function(r) {
			self.requests.push(new InjectionRequestInstance(r, dep));
		});
	}

	public addInstance(instance:any, name?: string):void {
		if (name) {
			console.log("Adding named dep: ", name);
			this.providedDependencies.push(new NamedProvidedDependency(instance, name));
		} else {
			this.providedDependencies.push(new PrototypeProvidedDependency(instance));
		}
	}

	public addNamedInstance(instance:any, name:string):void {
		this.providedDependencies.push(new NamedProvidedDependency(instance, name));
	}

	public resolve():void {
		console.log(">> Resolving dependencies");
		/*for (var i in this.prototypeInstances) {
			var l = this.prototypeInstances[i];
			this.injector.provideAllWith(this.prototypeInstances, l);
		}*/

		/*for (var i in this.providedDependencies) {
			if (! this.providedDependencies.hasOwnProperty(i)) continue;
			var dep = this.providedDependencies[i];
			//this.injector.provideAllWith(this.providedDependencies, dep);
			this.injector.provideAllDependenciesWith(this.providedDependencies, dep);
		}*/

		// Build the request list
		for (var i in this.providedDependencies) {
			if (! this.providedDependencies.hasOwnProperty(i)) continue;
			var dep = this.providedDependencies[i];
			this.addToRequestList(dep);
		}

		// Resolve the requests
		for (var i in this.requests) {
			if (! this.requests.hasOwnProperty(i)) continue;
			var r = this.requests[i];
			this.injector.resolveRequest(r.request, r.instance, this.providedDependencies);
		}
	}

}

export = DependencyInjectionContext;