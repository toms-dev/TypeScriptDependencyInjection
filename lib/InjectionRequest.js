var InjectionRequest = (function () {
    function InjectionRequest(propertyKey, targetPrototype, valuePrototype) {
        if (typeof (targetPrototype) == "function") {
            throw new Error("Should pass the prototype for the target '" + targetPrototype.name + "', not its constructor!");
        }
        if (typeof (valuePrototype) == "function") {
            throw new Error("Should pass the prototype for the value '" + valuePrototype.name + "', not its constructor!");
        }
        this.propertyKey = propertyKey;
        this.targetPrototype = targetPrototype;
        this.valuePrototype = valuePrototype;
        this.loadingCallback = function (value) {
            this[propertyKey] = value;
        };
    }
    InjectionRequest.prototype.matches = function (value) {
        return this.valuePrototype.isPrototypeOf(value);
    };
    return InjectionRequest;
})();
module.exports = InjectionRequest;
//# sourceMappingURL=InjectionRequest.js.map