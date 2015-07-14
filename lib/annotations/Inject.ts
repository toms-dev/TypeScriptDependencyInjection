/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('../InjectionRequest');
import PrototypeInjectionRequest = require('../PrototypeInjectionRequest');
import NamedInjectionRequest = require('../NamedInjectionRequest');

import Singleton = require('../Singleton');

import Config = require('../Config');

export function Injection(typeToInject) {
	return function (target:Object, propertyKey:string | symbol) {
		addPrototypeInjectionRequest(target, typeToInject.prototype, propertyKey);
	}
}

export function NamedInjection(name, typeToInject?) {
	var proto = typeToInject ? typeToInject.prototype : null;
	return function (target:Object, propertyKey:string | symbol) {
		addNamedInjectionRequest(target, name, propertyKey, proto);
	}
}

export function AutoInject(dependencyClass) {
	console.log("Auto inject");
	if (!dependencyClass) throw new Error("Missing parameter!");
	return function (prototype, propertyKey) {
		console.log("\tOn "+propertyKey+" as "+dependencyClass.name);

		// We define this as a safeguard if the user doesn't call @DirectLoad
		Object.defineProperty(prototype, propertyKey, {
			get: function () {
				// If we don't have to use getters, we'll use the first call to inject
				// all the values
				console.log("Calling getter! ", Config.useGetters);
				if (! Config.useGetters) {
					console.log("derp");
					var isInjected = Reflect.getOwnMetadata("isInjected", prototype) ? true : false;
					if (! isInjected) {
						console.warn("Warning: Config.useGetters=false but the @"+(<any>DirectLoad).name+" decorator" +
							" was" +
							" not put on the class " +prototype.constructor.name+".");
						//console.log("Prototype of "+prototype.constructor.name+" was not injected!");
						removeGettersFromPrototype(prototype);
						autoLoadInjectors(this, prototype);
					}
				}
				//console.log("This=", this);
				return Singleton.getSingleton(dependencyClass).get()
			},
			enumerable: true,
			configurable: true // to be able to remove it from the prototype later
		});

		// We define this if the user wants to use the @DirectLoad annotation
		var singletons:{[propertyKey: string]: any} = Reflect.getOwnMetadata("singletonInjectors", prototype) || {};
		singletons[propertyKey] = function () {
			this[propertyKey] = Singleton.getSingleton(dependencyClass).get();
		};
		Reflect.defineMetadata("singletonInjectors", singletons, prototype);

		// TODO: overload constructor?
		return prototype;
	}
}

function autoLoadInjectors(target, proto) {
	Reflect.defineMetadata("isInjected", true, proto);
	var singletonInjectors = Reflect.getOwnMetadata("singletonInjectors", proto) || [];
	loadSingletonInjectors(singletonInjectors, target);
}

function loadSingletonInjectors(singletonInjectors, target) {
	for (var propertyKey in singletonInjectors) {
		if (!singletonInjectors.hasOwnProperty(propertyKey)) continue;
		var s = singletonInjectors[propertyKey];
		console.log("Loading");
		s.apply(target);
	}
}

function removeGettersFromPrototype(proto) {
	var singletonInjectors:{[propertyKey: string]: any} = Reflect.getOwnMetadata("singletonInjectors", proto) || {};
	for (var propertyKey in singletonInjectors) {
		if (!singletonInjectors.hasOwnProperty(propertyKey)) continue;
		// TODO YOU ARE HERE: delete key from proto
		console.log("\tDeleting proto: "+propertyKey);
		if (! delete proto[propertyKey]) {
			throw new Error("Failed to delete property getter!");
		}
	}
}

export function DirectLoad(constructor):any {
	console.log("Auto load...");
	var proto = constructor.prototype;

	// Remove the getter override
	removeGettersFromPrototype(proto);

	var wrapper = function () {
		autoLoadInjectors(this, proto);
		constructor.apply(this, arguments)
	};

	wrapper.prototype = proto;

	return wrapper;
}

function addInjectionRequest(targetPrototype, injectionPrototype, request:InjectionRequest) {
	var protoName = targetPrototype.constructor.name;
	var injectionName = injectionPrototype ? injectionPrototype.constructor.name : null;

	// Check that the names are valid
	//
	if (!protoName) throw new Error("Incorrect prototype! No name found!");
	// Throw error if the 'injectionPrototype' is provided but the name is a false-value
	if (injectionPrototype && !injectionName) throw new Error("Incorrect prototype! No name found!");

	// Register the injection request
	var protoInjectionRequests:InjectionRequest[];
	var DEP_INJ_REQUESTS_KEY = "dependencyInjection.requests";
	if (!Reflect.hasMetadata(DEP_INJ_REQUESTS_KEY, targetPrototype)) {
		protoInjectionRequests = [];
		Reflect.defineMetadata(DEP_INJ_REQUESTS_KEY, [], targetPrototype);
	} else {
		protoInjectionRequests = Reflect.getMetadata(DEP_INJ_REQUESTS_KEY, targetPrototype)
	}
	protoInjectionRequests.push(request);
	Reflect.defineMetadata(DEP_INJ_REQUESTS_KEY, protoInjectionRequests, targetPrototype);
}

function addPrototypeInjectionRequest(targetPrototype, injectionPrototype, propertyKey) {
	var request = new PrototypeInjectionRequest(propertyKey, targetPrototype, injectionPrototype);
	addInjectionRequest(targetPrototype, injectionPrototype, request);
}

function addNamedInjectionRequest(targetPrototype, name:string, propertyKey:string | symbol, injectionPrototype) {
	var request = new NamedInjectionRequest(<string> propertyKey, targetPrototype, name, injectionPrototype);
	addInjectionRequest(targetPrototype, injectionPrototype, request);
}
