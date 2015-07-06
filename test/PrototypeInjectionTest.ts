/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');

import Deps = require('../index');

var assert = chai.assert;

class Dependency1 {
}
class Dependency2 {
}
class SubDependency1 extends Dependency1 {
}

class MyClass {
	@Deps.Injection(Dependency1)
	public dep:Dependency1;
}

class MyChildClass extends MyClass {

}

class SelfInjectingClass {
	@Deps.Injection(SelfInjectingClass)
	public dep:SelfInjectingClass;
}

describe("PrototypeInjection unit test", () => {
	var context:Deps.Context,
		instance:MyClass,
		dep1:Dependency1,
		dep2:Dependency2;
	beforeEach(() => {
		context = new Deps.Context();
		instance = new MyClass();
		dep1 = new Dependency1();
		dep2 = new Dependency2();
	});
	it("should be injected when the prototype matches", () => {
		context.addInstance(instance);
		context.addInstance(dep1);
		context.resolve();

		assert.equal(instance.dep, dep1, "The dependence is injected");
	});

	it("should not be injected when the prototype is different", () => {
		context.addInstance(instance);
		context.addInstance(dep2);

		context.resolve();
		assert.isUndefined(instance.dep, "The dependence is undefined");
	});

	it("should only inject the prototypes that matches", () => {
		context.addInstance(instance);
		context.addInstance(dep2); // add a non-matching dependency to the context
		context.addInstance(dep1);
		context.addInstance(dep2); // add a non-matching dependency to the context
		context.resolve();

		assert.equal(instance.dep, dep1, "The right dependence is injected");
	});

	it("should also inject if the target instance is a child of the annotated class", () => {
		instance = new MyChildClass();
		context.addInstance(instance);
		context.addInstance(dep1);
		context.resolve();

		assert.equal(instance.dep, dep1, "The dependence is injected");
	});

	it("should throw an exception if the context is ambiguous", () => {
		context.addInstance(instance);
		context.addInstance(dep1);
		context.addInstance(new Dependency1());

		chai.expect(() => {
			context.resolve();
		}).to.throw();
	});
	it("should throw an exception if the context is ambiguous because of inheritance", () => {
		context.addInstance(instance);
		context.addInstance(dep1);
		context.addInstance(new SubDependency1());

		chai.expect(() => {
			context.resolve();
		}).to.throw();
	});

	it("should not inject itself", () => {
		var self1 = new SelfInjectingClass();
		context.addInstance(self1);
		context.resolve();

		assert.isUndefined(self1.dep);
	});

	it("should not create an ambiguous context thanks to self-injection prevention", () => {
		var self1 = new SelfInjectingClass();
		var self2 = new SelfInjectingClass();
		context.addInstance(self1);
		context.addInstance(self2);
		context.resolve();
		assert.equal(self1.dep, self2);
		assert.equal(self2.dep, self1);
	});
});
