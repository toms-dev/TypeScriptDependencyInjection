# TypeScript dependency injection library [![Build Status](https://travis-ci.org/toms-dev/TypeScriptDependencyInjection.svg?branch=master)](https://travis-ci.org/toms-dev/TypeScriptDependencyInjection)
This TypeScript library allows you to easily declare and resolve dependencies, injecting them in your classes attributes, using eye-candy TypeScript annotations.

*Author:* Tom Guillermin - [http://www.tomsdev.com](http://www.tomsdev.com)

[(Shortcut to "Getting started" section)](#getting-started)

## Requirements

 - TypeScript compiler 1.5 or higher
 - EcmaScript5-compliant engine (nodejs versions >= .0.10 will do fine)
 
## Who is it for?

This library is primarily aimed at framework developers but any programmer that want clean and concise code will surely enjoy it too! It's a great way to reduce redundant boilerplate code.


**Side-note about the terminology:** The official term of the `@Something` syntax in TypeScript is "decorator", but I might inadvertently call it "annotation" quite frequently.

## Features

- **Powerful**. Resolves dependencies by prototype and/or name.
- **Concise**. Using TypeScript annotations will be a real pleasure for your eyes. I promise.
- **Expressive**. By declaring multiple contexts, you have fine control of the resolution process.
- **Safe**. The solver automatically detects ambiguous contexts and prevent unexpected behaviors.
- **Forgiving.** Even if you forget an annotation (eg. @DirectLoad), the framework will warn you and find a way around to make things work.

## umh... dependency injection?

Dependency injection allows you to reduce coupling by **dynamically setting ("injecting") variables** where they need to be.

For example, let's say I'm writing some controllers and I want to be able to send emails from them. I can write an `EmailService` class and provide dynamically its instance to any controller that requests it.
Dependency injection will allow me to have a clean and unified syntax for both requesting and providing the `EmailService` (see below for an example).



## Getting started

First you have to install the library with NPM:
```bash
$ npm install ts-dependency-injection --save
```

Then import the library in your TypeScript code using:

```TypeScript
	import Deps = require('ts-dependency-injection'');
```


### Manual context resolution

Then, you can declare a dependency using the following annotation:
```TypeScript
class MyClass {

	@Deps.Inject(MyDependency)
	public dep: MyDependency;

}
```
Here, you are declaring that instances of *MyClass* needs an instance of *MyDependency* to work properly.

To provide an instance of the dependency to an instance of *MyClass*, you have to
create a **dependency context**.
A context is a way to explicitly define which values are available during the resolution.

All you have to do is add all the values that participates in the context and run the resolution.
To create the context and resolve the dependencies: 
```TypeScript
	// Instantiate everything that has to
	var dep = new MyDependency();
	var instance = new MyClass();
	
	var context = new Deps.Context();
	
	// Provide the values to the context
	context.addValue(dep);
	context.addValue(instance);
	
	// Resolve all the dependencies
	context.resolve();
```
The dependency matching is performed here on the prototypes, but it can also be performed on names.

### Named dependencies
You have the ability to give names to dependencies to avoid collisions. You have to use another annotation, `NamedInjection`:
```TypeScript
class MyClass {
	@Deps.NamedInjection("some_name", MyDependency)
	private attr: MyDependency;
}
```
Then, you can add the values to the context by specifying their name:
```TypeScript
	context.addNamedValue(new MyDependency(), "some_name");
	// or an equivalent syntax:
	context.addValue(new MyDependency(), "some_name");
```

```TypeScript
class MyClass {
	@Deps.NamedInjection("my dep", MyDependency)
	public dep: MyDependency;
}

// [...] later in the code:
	context.addValue(dep, "my dep");
	context.addValue(instance, "an instance");
```

## Inheritance
Of course, the resolution support inheritance in the dependencies.

*Example*
```TypeScript
class Dep2 extends MyDependency {
	// empty class
}
```	
*Dep2* instances will be successfully matched as a *MyDependency* during the resolution.


### Injecting primitives
You can inject primitive types by name the same way you do with class instances.
The only thing you have to do is adding them to the context:
```TypeScript
	context.addValue(1, "attr1");				// number
	context.addValue("message", "attr2");		// string
	context.addValue(true, "attr3");			// boolean
	context.addValue(function() {				// function
		console.log("Hello, I was injected !");
	}, "attr4");
```
**Note**: As primitive types do not have a prototype, there is currently no way of directly specifying its type in the annotation. I'm currently working on a solution using *strings* parameters (like this: `@Deps.NamedInjection("attr1", "number")`) but this is experimental.

### Automatic injection for singletons

If you have some singletons classes, you may want to expose them at various places in your code.
This library allows you to automatically instantiate and inject singleton without having anything to do except annotating your class!

First, declare your singleton:
```TypeScript
@Deps.Singleton
class MySingleton {
	public singletonMethod(): void {
        console.log("Hello!");
	}
}
```

Then, request it:
```TypeScript
class MyClass {
	@Deps.AutoInject(MySingleton)
	public attr: MySingleton;
}
```
And that's it! The singleton is available on every instance of `MyClass`:
```TypeScript
	var a = new MyClass();
	a.attr.singletonMethod();  // prints "Hello!" in the console
```

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
The benefit of this is that it will **allow** you to have **two instances with the same name and same type in the same context**, to make them cross-inject into one another,
```TypeScript
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

**Note.** It is also possible to use an non-named injection annotation in the class declaration:
```TypeScript
	@Deps.Injection(SelfInjectingClass)
	public dep: SelfInjectingClass;
```


## todo list

 - ~~named dependencies~~
 - ~~strict context resolution (optional)~~
 - ~~unit tests~~
 -  primitive injection by type declaration ("number"/"string"/"boolean")
 -  ~~singleton dependency magic injection
 - context extension : be able to "copy" a context, and add values into this "child" context, without reaffecting 
 values from  the parent context. Example: server context -> match context -> player context
 - Documentation : example of Annotation wrapping for framework developpers.
- register user-created singletons
