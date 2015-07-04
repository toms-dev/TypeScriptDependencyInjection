/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
require('reflect-metadata');
var DependencyInjector = (function () {
    function DependencyInjector() {
        this.injectionRequests = [];
        this.injectionListeners = [];
    }
    DependencyInjector.prototype.addInjectionRequest = function (ir) {
        this.injectionRequests.push(ir);
    };
    DependencyInjector.prototype.addInjectionListener = function (il) {
        console.log("Added injection listener instance:", il.constructor.name);
        this.injectionListeners.push(il);
    };
    DependencyInjector.prototype.provideWith = function (target, value) {
        if (target == undefined || value == undefined)
            return;
        var proto = Object.getPrototypeOf(target);
        var DEP_INJ_REQUESTS_KEY = "dependencyInjection.requests";
        var requests = Reflect.getMetadata(DEP_INJ_REQUESTS_KEY, proto); //proto.__injectionRequests || [];
        console.log("Requests of " + proto.constructor.name + ":", requests);
        // TODO: check if inherited classes work
        for (var i in requests) {
            var r = requests[i];
            // If the requested object prototype name match the value prototype name
            if (r.matches(value)) {
                console.log("\t>> Providing '" + value.constructor.name + "' to '" + target.constructor.name + "'.");
                // Perform the loading of the value
                r.loadingCallback.apply(target, [value]);
            }
        }
    };
    DependencyInjector.prototype.provideAllWith = function (target, value) {
        for (var i in target) {
            var t = target[i];
            this.provideWith(t, value);
        }
    };
    // deprecated
    DependencyInjector.prototype.triggerDependencyHook = function (kind, value) {
        console.log("Dependency hook triggered: ", kind);
        for (var i in this.injectionListeners) {
            var obj = this.injectionListeners[i];
            var protoName = obj.constructor.name;
            if (protoName) {
                var requests = this.getInjectionRequestsByPrototypeName(protoName);
                requests = requests.filter(function (req, i) {
                    return req.kind == name;
                });
                for (var ri in requests) {
                    var r = requests[ri];
                    r.loadingCallback(value);
                }
            }
        }
    };
    DependencyInjector.prototype.getInjectionRequestsByPrototypeName = function (protoName) {
        return this.injectionRequests.filter(function (req, i) {
            return req.prototypeName == protoName;
        });
    };
    return DependencyInjector;
})();
module.exports = DependencyInjector;
//# sourceMappingURL=Injector.js.map