export interface TestInterface1 {
	test1(): void;
}

export class TestClass1 implements TestInterface1 {
	constructor(s: string) {
	}

	public test1(): void { }
	protected test2(): void { }
}
