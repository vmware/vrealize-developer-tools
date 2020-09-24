import TestClass1, { TestClass2 } from "com.vmware.pscoe.tests/action1";

describe("Test Case", () => {
	it("Can add 1 and 2", () => {
		expect(1 + 2).toBe(3);
	});

	it("Can create imported classes", () => {
		new TestClass1();
		new TestClass2();
	});
});
