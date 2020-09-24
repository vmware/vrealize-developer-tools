import { ClassDecorator, ClassDecorator2, FieldDecorator, StaticFieldDecorator, MethodDecorator, StaticMethodDecorator, inject } from "./decorators";

/** Some leading class comment */
@ClassDecorator
@ClassDecorator2("foo")
/** More leading class comment */
export class TestClass1 {
	/** Some leading member comment */
	@FieldDecorator(1)
	field1: string;

	/** Some leading constructor comment */
	constructor(@inject() someVar: any) {
		/** in-constructor comment */
		console.log(`some stuff`)
	}

	/** Some leading static field comment */
	@StaticFieldDecorator
	static field2: number;

	/** Some leading instance method comment */
	@MethodDecorator("bar")
	method1() {
		/** in-inst member comment */
		console.log(`some stuff`)
	}

	/** Some leading static method comment */
	@StaticMethodDecorator
	static method2() {
		/** in-staic member comment */
		console.log(`some stuff`)
	}
}
