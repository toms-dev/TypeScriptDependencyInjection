#TypeScript dependency injection library
This library allows you to easily declare and resolve dependencies on class properties using
TypeScript annotations.

**Notice:** This is a work-in-progress and many features are missing for now (liked named dependencies) and the package.json is incomplete.

*Requirements:*

 - TypeScript compiler 1.5 or higher
 - EcmaScript5-compliant engine (nodejs versions >= .0.10 will do fine)

##Examples
Declaring a dependency :

	class MyClass {
		@Deps.Inject(MyDependency)
		public a: MyDependency;
	}

Here, you are declaring that the class *MyClass* needs an instance of *MyDependency* to work properly.
To provide the dependency to an instance of *MyClass*, you have to create a dependency context in which the dependency will be available.
To resolve the dependencies: 

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

