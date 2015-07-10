/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import chai = require('chai');
import sinon = require('sinon');

import Deps = require('../index');

var assert = chai.assert;

describe("Singleton unit test", () => {
	it("should be registered", () => {
		var test = require('../test-resources/UsingSingleton');

		var a = new test.MyClass();
		assert.isFalse(Object.keys(a).indexOf("attr") != -1);
		assert.isDefined(a.attr);
		assert.isNotNull(a.attr);
		assert.instanceOf(a.attr, test.MySingleton);
	});

	it.only("should have the value set directly if using @DirectLoad", () => {
		var test = require('../test-resources/UsingSingleton');

		var a = new test.MyClassWithAutoLoad();
		assert.isTrue(Object.keys(a).indexOf("attr") != -1, "value is set!");
	});
});