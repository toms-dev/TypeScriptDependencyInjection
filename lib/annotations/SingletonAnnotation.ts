
import SingletonClass = require('../Singleton');

function Singleton(constructor) {
	// Register it in the singleton registry
	SingletonClass.addSingleton(constructor);
}

export = Singleton;