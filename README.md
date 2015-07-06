#TypeScript dependency injection library
This library allows you to easily declare and resolve dependencies on class properties using
TypeScript annotations.

**Notice:** This is a work-in-progress and many features are missing for now (liked named dependencies) and the package.json is incomplete.

##Features

- dependency resolution by prototype
- dependency resolution by name
- declaration of different contexts to avoid collisions


##Requirements

 - TypeScript compiler 1.5 or higher
 - EcmaScript5-compliant engine (nodejs versions >= .0.10 will do fine)

##Examples

First you have to import the library using:
```
	import Deps = require('./lib/Deps');
```

Then, you can declare a dependency using the following annotation:
```
class MyClass {

	@Deps.Inject(MyDependency)
	public dep: MyDependency;

}
```
Here, you are declaring that instances of *MyClass* needs an instance of *MyDependency* to work properly.

To provide an instance of the dependency to an instance of *MyClass*, you have to
create a **dependency context** in which the dependency instance will be available.

To create the context and resolve the dependencies: 
```
	// Instantiate everything that has to
	var dep = new MyDependency();
	var instance = new MyClass();
	
	var context = new Deps.Context();
	
	// Provide the values to the context
	context.add(dep);
	context.add(instance);
	
	// Resolve all the dependencies
	context.resolve();
```
The dependency matching is performed on the prototypes.

Of course, you can still have dependency inheritance 
```
	class Dep2 extends MyDependency {
		[...]
	}
```	
*Dep2* instances will be matched for *MyDependency* dependencies during the resolution.

### Named dependencies
You have the ability to give names to dependencies to avoid collisions. You have to use another annotation, `NamedInjection`:
```
class MyClass {
	@Deps.NamedInjection("some_name", MyDependency)
	private attr: MyDependency;
}
```
Then, you can add the values to the context by specifying their name:
```
context.addNamedValue(new MyDependency(), "some_name");
// or an equivalent syntax:
context.addValue(new MyDependency(), "some_name");
```

### Injecting primitives
You can inject primitive types by name the same way you do with class instances.
The only thing you have to do is adding them to the context:
```
context.addValue(1, "attr1");				// number
context.addValue("message", "attr2");		// string
context.addValue(true, "attr3");			// boolean
context.addValue(function() {				// function
	console.log("Hello, I was injected !");
}, "attr4");
```
Currently, there no way of specifying a primitive type in the annotation (like this `@Deps.NamedInjection("attr1", "number")` but this feature is **in the todo list**!

### Strict resolution
By default, when you call `context.resolve()`, if a dependency is not found in the context, nothing happens and the class attribute is `undefined` (or whatever default value you provided).
You may want to ensure that all the dependencies were met. To do so, you can use `context.resolveStrict()` or `context.resolve(true)`. The injection system will throw an exception if something's missing.

### Ambiguous context
It might happen that when resolving a context, you get an error saying that the context is ambiguous. It means that there are *many possible values* for a *single* injection request, and the injection system can't guess which one has to be used.

There are two probable causes of ambiguous context error :

 - the context contains **multiple instances** of the **same class** (or of some _inherited classes_) that are **not named**
 - the context contains **multiple instances** of the **same class** with the **same name**

### Self-injection & same-name injection requests
The injection system will **prevent an instance from injecting into itself** (_"why ?"_).
The benefit of this is that it will **allow** you to have **two instances with the same name and same type** in the **same context**, to make them **cross-inject** into one another,
```
class SelfInjectingClass {
	@Deps.NamedInjection("a_friend", SelfInjectingClass)
	public dep: SelfInjectingClass;
}

var self1 = new SelfInjectingClass();
var self2 = new SelfInjectingClass();

context.addValue(self1, "a_friend");
context.addValue(self2, "a_friend");
context.resolve(); 	// no error! :)
```

**Note.** It is also possible to use an non-named injection annotation:
```
@Deps.Injection(SelfInjectingClass)
public dep: SelfInjectingClass;
```


##todo list

 - ~~named dependencies~~
 - ~~strict context resolution (optional)~~
 - ~~unit tests~~
 - primitive injection by type declaration ("number"/"string"/"boolean")
 - proper *package.json*