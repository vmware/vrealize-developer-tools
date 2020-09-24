export interface TestInterface1 {
	foo(): void;
	bar(): void;
}

export interface TestInterface2 {
	foo(): void;
	bar(): void;
}

interface TestInterface3 {
	foo(): void;
	bar(): void;
}

export { TestInterface3 };

/**
 * @return {Any}
 */
(function (x: TestInterface1) {
	x.foo();
	System.log("Test Action");
});
