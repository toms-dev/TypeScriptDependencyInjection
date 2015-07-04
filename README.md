#TypeScript dependency injection library
This library allows you to easily declare and resolve dependencies on class properties using
TypeScript annotations.

**Notice:** This is a work-in-progress and many features are missing for now (liked named dependencies) and the package.json is incomplete.

*Requirements:*

 - TypeScript compiler 1.5 or higher
 - EcmaScript5-compliant engine (nodejs versions >= .0.10 will do fine)

##Examples

First you have to import the library using:

	import Deps = require('./lib/Deps');


The, you can declaring a dependency using the following annotation:

	class MyClass {

		@Deps.Inject(MyDependency)
		public dep: MyDependency;

	}

Here, you are declaring that the class *MyClass* needs an instance of *MyDependency* to work properly.

To provide an instance of the dependency to an instance of *MyClass*, you have to
create a dependency context in which the dependency instance will be available.

To resolve the dependencies: 

	// Instantiate everything that has to
	var dep = new MyDependency();
	var instance = new MyClass();
	
	var context = new Deps.Context();
	
	// Provide the values to the context
	context.add(dep);
	context.add(instance);
	
	// Resolve all the dependencies
	context.resolve();

The dependency matching is performed on the prototypes.

Of course, you can still have dependency inheritance 

	class Dep2 extends MyDependency {
		[...]
	}
	
*Dep2* instances will be matched for *MyDependency* dependencies during the resolution.

##TODO

 - named dependencies
 - proper *package.json*