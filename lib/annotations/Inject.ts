/**
 * Created by Tom on 02/07/2015.
 */

/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts" />

import 'reflect-metadata';
import InjectionRequest = require('../InjectionRequest');

function Inject(typeToInject) {
	return function (target:Object, propertyKey:string | symbol) {
		addInjectionRequest(target, typeToInject.prototype, propertyKey);
	}
}

// TODO: NamedInjection

function addInjectionRequest(targetPrototype, injectionPrototype, propertyKey) {
	var proto:any = targetPrototype;
	var protoName = targetPrototype.constructor.name;
	var injectionName = injectionPrototype.constructor.name;

	// Check that the names are valid
	if (! protoName) throw new Error("Incorrect prototype! No name found!");
	if (! injectionName) throw new Error("Incorrect prototype! No name found!");

	// Register the injection request
	/*if (proto.__injectionRequests == undefined) proto.__injectionRequests = [];
	proto.__injectionRequests.push(new InjectionRequest(propertyKey, targetPrototype,
	 injectionPrototype));*/
	var protoInjectionRequests: InjectionRequest[];
	var DEP_INJ_REQUESTS_KEY = "dependencyInjection.requests";
	if (! Reflect.hasMetadata(DEP_INJ_REQUESTS_KEY, targetPrototype)) {
		protoInjectionRequests = [];
		Reflect.defineMetadata(DEP_INJ_REQUESTS_KEY, [], targetPrototype);
	} else {
		protoInjectionRequests = Reflect.getMetadata(DEP_INJ_REQUESTS_KEY, targetPrototype)
	}
	protoInjectionRequests.push(new InjectionRequest(propertyKey, targetPrototype, injectionPrototype));
	Reflect.defineMetadata(DEP_INJ_REQUESTS_KEY, protoInjectionRequests, targetPrototype);
}

export = Inject;