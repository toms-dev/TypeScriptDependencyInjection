/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');

import Deps = require('../index');

var assert = chai.assert;

class MyDependency {
}

class MyClass {
	@Deps.Injection(MyDependency)
	public dep:MyDependency;
}

describe("PrototypeInjection unit test", () => {
	it("should be injected when the prototype matches", () => {

	});

	it("should not be injected when the prototype is different", () => {

	});

	it("should only inject the prototypes that matches", () => {

	});

	it("should throw an exception if the context is ambiguous", () => {
		// TODO: case where the same prototype is provided twice
	});
});
