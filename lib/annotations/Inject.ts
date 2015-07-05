/**
 * Created by Tom on 02/07/2015.
 */

/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('../InjectionRequest');
import PrototypeInjectionRequest = require('../PrototypeInjectionRequest');
import NamedInjectionRequest = require('../NamedInjectionRequest');

export function Injection(typeToInject) {
	return function (target:Object, propertyKey:string | symbol) {
		addPrototypeInjectionRequest(target, typeToInject.prototype, propertyKey);
	}
}

export function NamedInjection(name, typeToInject?) {
	return function (target:Object, propertyKey:string | symbol) {
		addNamedInjectionRequest(target, name, propertyKey, typeToInject.prototype);
	}
}

// TODO: NamedInjection

function addInjectionRequest(targetPrototype, injectionPrototype, propertyKey:string | symbol, request:InjectionRequest) {
	var proto:any = targetPrototype;
	var protoName = targetPrototype.constructor.name;
	var injectionName = injectionPrototype.constructor.name;

	// Check that the names are valid
	if (!protoName) throw new Error("Incorrect prototype! No name found!");
	if (!injectionName) throw new Error("Incorrect prototype! No name found!");

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
	addInjectionRequest(targetPrototype, injectionPrototype, propertyKey, request);
}

function addNamedInjectionRequest(targetPrototype, name:string, propertyKey:string | symbol, injectionPrototype) {
	var request = new NamedInjectionRequest(<string> propertyKey, targetPrototype, name, injectionPrototype);
	addInjectionRequest(targetPrototype, injectionPrototype, propertyKey, request);
}
