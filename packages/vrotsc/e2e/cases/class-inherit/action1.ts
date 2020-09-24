export interface TestInterface1 {
	test1(): void;
}

export interface TestInterface2 {
	test1(): void;
}

export interface TestInterface3 {
	test1(): void;
}

export class TestClass1 implements TestInterface1 {
	constructor(s: string) {
	}

	public test1(): void { }
	protected test2(): void { }
}

export class TestClass2 extends TestClass1 implements TestInterface2 {
	constructor(s: string) {
		super(s);
	}

	public test1(): void {
		super.test1();
	}

	protected test2(): void {
		super.test2();
	}

	protected test3(): void {
	}
}

export class TestClass3 extends TestClass2 implements TestInterface3 {
	constructor(s: string) {
		super(s);
	}

	public test1(): void {
		super.test1();
	}

	protected test2(): void {
		super.test2();
	}

	protected test3(): void {
		super.test3();
	}
}
