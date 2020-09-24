import { TestInterface1, TestType } from "./interfaces";

let data: TestInterface1 = {
	type: "test1",
}; 

let type: TestType = "test2";

console.log(JSON.stringify(data));
console.log(type);
