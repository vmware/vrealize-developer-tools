export interface TestInterface1 {
    test1(): void;
}
export interface TestInterface2 {
    test1(): void;
}
export interface TestInterface3 {
    test1(): void;
}
export declare class TestClass1 implements TestInterface1 {
    constructor(s: string);
    test1(): void;
    protected test2(): void;
}
export declare class TestClass2 extends TestClass1 implements TestInterface2 {
    constructor(s: string);
    test1(): void;
    protected test2(): void;
    protected test3(): void;
}
export declare class TestClass3 extends TestClass2 implements TestInterface3 {
    constructor(s: string);
    test1(): void;
    protected test2(): void;
    protected test3(): void;
}
