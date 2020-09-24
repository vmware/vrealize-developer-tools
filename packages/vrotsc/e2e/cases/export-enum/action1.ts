import { TestEnum, TestSubClass2 } from "./sub/action2";

export class TestClass2 extends TestSubClass2 {
	constructor(s: string) {
		super(s);
		System.log("" + TestEnum.ALA);
	}
}
