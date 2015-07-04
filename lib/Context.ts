import DependencyInjector = require('./Injector');

class DependencyInjectionContext {

    private listeners: any[];
    private injector: DependencyInjector;

    constructor() {
        this.listeners = [];
        this.injector = new DependencyInjector();
    }

    public add(l: any): void {
        this.listeners.push(l);
    }

    public resolve(): void {
        console.log(">> Resolving dependencies");
        for (var i in this.listeners) {
            var l = this.listeners[i];
            this.injector.provideAllWith(this.listeners, l);
        }
    }

}

export = DependencyInjectionContext;