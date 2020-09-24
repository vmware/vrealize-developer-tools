import { TestClass2 as exp1, TestInterface } from "./sub/action2";

(function (exp1: TestInterface) {
	exp1.test();
});

export function testFunc(exp1: TestInterface): void {
	exp1.test();
}

export class TestClass1 {
	constructor(exp1: TestInterface) {
		exp1.test();
	}

	public test1(exp1: TestInterface): void {
		exp1.test();
	}
}
