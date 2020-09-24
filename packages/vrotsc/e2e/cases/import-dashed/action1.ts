import TestSubClass1, { TestSubClass2 } from "./sub-path/action2";

export default class TestClass1 extends TestSubClass1 {
	constructor(s: string) {
		super(s);
	}
}

export class TestClass2 extends TestSubClass2 {
	constructor(s: string) {
		super(s);
	}
}
