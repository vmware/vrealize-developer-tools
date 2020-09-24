export class Class1 {
	field1 = "test";
    field2 = 5;
	field3: string[] = [];
    field4 = {
        f: this.field1,
        f2: this.field2,
    };
    static staticField1 = "test1";

    constructor() {
        this.field2++;
        System.log("Class1.ctor");
    }
}

export class Class2 extends Class1 {
    field1 = "test2";
    field2 = 10;
    field5 = true;
    static staticField1 = "test2";
    static staticField2 = 10;
}

export class Class3 extends Class2 {
    field1 = "test3";
    field6 = 123;

    constructor(private field7 = "test7", field8 = "test8") {
        super();
        System.log("Class3.ctor");
    }
}
