// String
let str = "the brown fox jumped over the lazy dog";
str.startsWith("the brown")
str.endsWith("lazy dog");
str.padStart(50, "*");
str.padEnd(50, "lazy");

// Array
let arr = [1, 2, 3, 4, 5];
arr.find(x => x > 3);
arr.findIndex(x => x > 3);

// Set
let set = new Set<string>();
set.add("key1");
set.add("key1");
set.add("key2");
set.forEach(k => {
	console.log(k);
});

// Map
let map = new Map<string, string>();
map.set("key1", "value1");
map.set("key1", "value1");
map.set("key2", "value2");
map.forEach((k, v) => {
	console.log(`${k}=${v}`);
});

// Object
var obj = {
	startsWith: x => true,
	find: x => { },
	findIndex: x => 0,
};
obj.startsWith("test");
obj.find("test");
obj.findIndex("test");
