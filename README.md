This library allows you to easily declare Dependencies on class properties using
TypeScript annotations.

Requirements:
	* TypeScript compiler 1.5 or higher
	* EcmaScript5-compliant engine

#Examples
Declaring a dependency

`
class B {

	@Deps.Inject(A)
	public a:A;

}

`