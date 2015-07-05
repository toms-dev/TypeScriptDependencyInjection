import DependencyInjector = require('./Injector');

import ProvidedDependency = require('./ProvidedDependency');
import PrototypeProvidedDependency = require('./PrototypeProvidedDependency');
import NamedProvidedDependency = require('./NamedProvidedDependency');

class DependencyInjectionContext {

	private providedDependencies: ProvidedDependency[];

	private injector:DependencyInjector;

	constructor() {
		this.providedDependencies = [];
		this.injector = new DependencyInjector();
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
		for (var i in this.providedDependencies) {
			if (! this.providedDependencies.hasOwnProperty(i)) continue;
			var dep = this.providedDependencies[i];
			//this.injector.provideAllWith(this.providedDependencies, dep);
			this.injector.provideAllDependenciesWith(this.providedDependencies, dep);
		}
	}

}

export = DependencyInjectionContext;