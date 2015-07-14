/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');

import Deps = require('../index');

var assert = chai.assert;

describe("Singleton unit test", () => {
	it("should have the value available", () => {
		var test = require('../test-resources/UsingSingleton');

		var a = new test.MyClass();
		assert.isDefined(a.attr);
		assert.isNotNull(a.attr);
		assert.instanceOf(a.attr, test.MySingleton);

		var b = new test.MyClassWithDirectLoad();
		assert.equal(Object.keys(b).length, 1, "Object that are ");
	});
	it("should share the same singleton instance accross multiple values", () => {
		var test = require('../test-resources/UsingSingleton');

		var a = new test.MyClass();
		var b = new test.MyClass();

		assert.equal(a.attr, b.attr, "instance are shared");
	});

	describe("should use the Config", () => {
		it("should load the same config object", () => {
			var test = require('../test-resources/UsingSingleton');
			assert.equal(test.Config, Deps.Config, "Configs should be the same");
		});
		describe("useGetters", () => {
			describe("useGetters = false", () => {
				var test;
				var warningSpy;
				before(() => {
					Deps.Config.useGetters = false;
					test = require('../test-resources/UsingSingleton');
					warningSpy = sinon.spy(console, "warn");
				});

				it("should contains the injected attributes in the keys after a getter call", () => {
					console.log(Deps.Config.useGetters);
					assert.equal(test.Config, Deps.Config, "Configs should be the same");
					var a = new test.MyClass();
					assert.isTrue(Object.keys(a).indexOf("attr") == -1, "The key is not set yet");
					a.attr;	// trigger the loading
					assert.isTrue(Object.keys(a).indexOf("attr") != -1, "The key is set");
				});

				it("should warn that not using @DirectLoad is a perf killer...", () => {
					var a = new test.MyClass();
					a.attr;
					assert.isTrue(warningSpy.calledOnce);
				});
				it("should not warn when using @DirectLoad", () => {
					warningSpy.reset();
					var b = new test.MyClassWithDirectLoad();
					b.attr;
					assert.isFalse(warningSpy.called);
				});
			});

			describe("useGetter = true", () => {
				var test;
				before(() => {
					Deps.Config.useGetters = true;
					test = require('../test-resources/UsingSingleton');
				});

				it("is not expected to have the object in the keys because we're using an internal getter", () => {
					var a = new test.MyClass();
					a.attr; // just to trigger the getter
					assert.isTrue(Object.keys(a).indexOf("attr") == -1,
						"Object.keys(a) does not contain the key 'attr'");
				});
			})
		})
	});

	it("should have the value set directly if using @DirectLoad", () => {
		var test = require('../test-resources/UsingSingleton');

		var a = new test.MyClassWithDirectLoad();
		assert.isTrue(Object.keys(a).indexOf("attr") != -1, "value is set!");
	});
});