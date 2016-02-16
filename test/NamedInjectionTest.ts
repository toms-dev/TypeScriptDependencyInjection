import chai = require('chai');
import sinon = require('sinon');

import Deps = require('../index');

var assert = chai.assert;

class Dependency1 {
}
class Dependency2 {
}

class MyClass {
	@Deps.NamedInjection("my_dep1", Dependency1)	// with explicit prototype
	public dep1:Dependency1;

	@Deps.NamedInjection("my_dep2")	// no explicit prototype
	public dep2: Dependency2;
}

class MyChildClass extends MyClass {

}

class MyClassUsingPrototypeInjection {
	@Deps.Injection(Dependency1)	// no name here
	public dep: Dependency1;
}

class SelfInjectingClass {
	@Deps.NamedInjection("a_friend", SelfInjectingClass)
	public dep: SelfInjectingClass;
}

class AnyClass {

	@Deps.NamedInjection("attr1")
	public attr1: any;

	@Deps.NamedInjection("attr2")
	public attr2: any;

	@Deps.NamedInjection("attr3")
	public attr3: any;

	@Deps.NamedInjection("attr4")
	public attr4: any;

}


describe("NamedInjection unit test", () => {
	var context: Deps.Context,
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
		context.addValue(instance);
		context.addNamedValue(dep1, "my_dep1");
		context.addNamedValue(dep2, "my_dep2");
		context.resolve();

		assert.equal(instance.dep1, dep1, "The dependence is injected");
	});

	it("should not be injected when the name does not match", () => {
		context.addValue(instance);
		context.addValue(dep1, "derp");
		context.addValue(dep2, "hello");

		context.resolve();
		assert.isUndefined(instance.dep1, "The dependence is undefined");
	});

	it("should not be injected when the prototype is different, even with matching name", () => {
		context.addValue(instance);
		context.addValue(dep2, "my_dep1");

		context.resolve();
		assert.isUndefined(instance.dep1, "The dependence is undefined");
	});

	it("should inject a named provided dependency into an PrototypeInjectionRequest", () => {
		var instanceProto = new MyClassUsingPrototypeInjection();
		context.addValue(instanceProto);
		context.addValue(dep1, "some_random_name");
		context.resolve();

		assert.equal(instanceProto.dep, dep1);
	});

	it("should only inject for the name that matches", () => {
		context.addValue(instance);
		context.addValue(new Dependency1(), "some_name"); // add a non-matching dependency to the context
		context.addValue(dep1, "my_dep1");
		context.addValue(new Dependency1(), "some_other_name"); // add a non-matching dependency to the context
		context.resolve();

		assert.equal(instance.dep1, dep1, "The right dependence is injected");
	});

	it("should also inject if the target instance is a child of the annotated class", () => {
		instance = new MyChildClass();
		context.addValue(instance);
		context.addValue(dep1, "my_dep1");
		context.resolve();

		assert.equal(instance.dep1, dep1, "The dependence is injected");
	});

	it("should be able to inject basic types", () => {
		var anyInstance = new AnyClass();
		context.addValue(anyInstance);
		context.addValue(1, "attr1");
		context.addValue("message", "attr2");

		// The spy **replaces** the functions, it does not wrap it
		var fakeCallback = sinon.spy(function() {
		});

		context.addValue(fakeCallback, "attr3");
		context.addValue(true, "attr4");

		context.resolve();

		assert.isNumber(anyInstance.attr1, "attr1 is number");
		assert.isString(anyInstance.attr2, "attr2 is string");
		assert.isDefined(anyInstance.attr3, "attr3 is defined");
		assert.isFunction(anyInstance.attr3, "attr3 is a function");
		anyInstance.attr3();

		assert.isTrue(fakeCallback.calledOnce, "fakeCallback is called through attr3");
	});

	it("should throw an exception if the context is ambiguous because of the names", () => {
		context.addValue(instance);
		context.addValue(dep1, "my_dep1");
		context.addValue(new Dependency1(), "my_dep1");
		chai.expect(() => {
			context.resolve();
		}).to.throw();
	});

	it("should not inject itself", () => {
		var self1 = new SelfInjectingClass();
		context.addValue(self1, "a_friend");
		context.resolve();

		assert.isUndefined(self1.dep);
	});

	it("should not create an ambiguous context thanks to self-injection mecanism", () => {
		var self1 = new SelfInjectingClass();
		var self2 = new SelfInjectingClass();
		context.addValue(self1, "a_friend");
		context.addValue(self2, "a_friend");
		context.resolve();
		assert.equal(self1.dep, self2);
		assert.equal(self2.dep, self1);
	});

	it("should allow the resolution of dependencies that has the same names but different prototypes", () => {
		context.addValue(instance);
		context.addValue(new Dependency1(), "TEST");
		context.addNamedValue(dep2, "my_dep1");
		context.addValue(new Dependency1(), "TEST");
		context.addValue(dep1, "my_dep1");	// this one should be injected
		context.addValue(new Dependency1(), "TEST");
		context.addNamedValue(dep2, "my_dep1");
		context.addValue(new Dependency1(), "TEST");
		context.resolve();

		assert.equal(instance.dep1, dep1, "The right one should be injected");
	});
});
