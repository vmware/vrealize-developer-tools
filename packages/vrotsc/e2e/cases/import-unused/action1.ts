import TestClass1, { TestClass2, TestClass3 as TC3, default as TC4 } from "./action2";

let c1: TestClass1 = null;
let c2: TestClass2 = null;
let c3: TC3 = null;
let c4: TC4 = null;
console.log(JSON.stringify(c1));
console.log(JSON.stringify(c2));
console.log(JSON.stringify(c3));
console.log(JSON.stringify(c4));
