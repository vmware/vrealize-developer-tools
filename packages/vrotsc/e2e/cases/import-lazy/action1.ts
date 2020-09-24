const action2 = require("./action2");

export class TestClass1 {
    constructor(private readonly action2: any) { }

    test1(p) {
        action2(p);
        action2.action2(p);
        action2.action2.action2(p);
        this.action2(p);
        this.action2.action2(p);
        action2(p);

    }

    test2(action2, p) {
        action2.action2(p);
    }

    test3(p) {
        return require(p);
    }

    test4(p) {
        const mod = require(p);
        return mod;
    }
}

Object.keys(action2);

var arr1 = [...action2, ""];

var obj1 = {
    ...action2,
    prop1: "val",
    prop2: 5,
};

export default action2;

export {
    action2
};