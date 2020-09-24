export declare class Class1 {
    field1: string;
    field2: number;
    field3: string[];
    field4: {
        f: string;
        f2: number;
    };
    static staticField1: string;
    constructor();
}
export declare class Class2 extends Class1 {
    field1: string;
    field2: number;
    field5: boolean;
    static staticField1: string;
    static staticField2: number;
}
export declare class Class3 extends Class2 {
    private field7;
    field1: string;
    field6: number;
    constructor(field7?: string, field8?: string);
}
