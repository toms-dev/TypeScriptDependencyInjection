var DependencyInjector = require('./Injector');
var DependencyInjectionContext = (function () {
    function DependencyInjectionContext() {
        this.listeners = [];
        this.injector = new DependencyInjector();
    }
    DependencyInjectionContext.prototype.add = function (l) {
        this.listeners.push(l);
    };
    DependencyInjectionContext.prototype.resolve = function () {
        console.log(">> Resolving dependencies");
        for (var i in this.listeners) {
            var l = this.listeners[i];
            this.injector.provideAllWith(this.listeners, l);
        }
    };
    return DependencyInjectionContext;
})();
module.exports = DependencyInjectionContext;
//# sourceMappingURL=Context.js.map