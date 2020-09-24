interface TestInterface {
    prop1?: {
        prop2?: {
            prop3?: string;
        }
    }
}

var obj: TestInterface = {};
System.log(`obj.prop1.prop2.prop3=${obj.prop1?.prop2?.prop3}`);