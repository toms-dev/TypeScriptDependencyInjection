/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('../InjectionRequest');
import PrototypeInjectionRequest = require('../PrototypeInjectionRequest');
import NamedInjectionRequest = require('../NamedInjectionRequest');

import Singleton = require('../Singleton');

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
		/*prototype.__defineGetter__(propertyKey, function() {
		 return "derp";
		 });*/
		Object.defineProperty(prototype, propertyKey, {
			get: function () {
				return Singleton.getSingleton(dependencyClass).get()
			}
		});

		var a = new (prototype.constructor)();
		console.log("aaaa=", a.attr);

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

export function DirectLoad(constructor):any {
	console.log("Auto load...");
	var proto = constructor.prototype;
	for (var propertyKey in singletonInjectors) {
		if (!singletonInjectors.hasOwnProperty(propertyKey)) continue;
		// TODO YOU ARE HERE: delete key from proto
	}
	var autoLoad = function (singletonInjectors, target) {
		for (var propertyKey in singletonInjectors) {
			if (!singletonInjectors.hasOwnProperty(propertyKey)) continue;
			var s = singletonInjectors[propertyKey];
			console.log("Loading");
			s.apply(target);
		}
	};
	var wrapper = function () {
		var singletonInjectors = Reflect.getOwnMetadata("singletonInjectors", proto) || [];
		autoLoad(singletonInjectors, this);
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
