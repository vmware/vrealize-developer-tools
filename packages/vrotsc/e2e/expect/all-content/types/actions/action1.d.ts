export interface TestInterface1 {
    test1(): void;
}
export declare class TestClass1 implements TestInterface1 {
    constructor(s: string);
    test1(): void;
    protected test2(): void;
}
