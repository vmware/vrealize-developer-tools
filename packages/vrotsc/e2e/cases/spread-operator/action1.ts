let data1 = {
	field1: "value1",
	field2: "value2",
};

let data2 = {
	field3: "value3",
	...data1,
};

let data3 = {
	...data2,
	field4: "value4",
};

let data4 = {
	field3: "value3",
	...data3,
	field4: "value4",
	...{
		...{
			field5: "value6",
		},
		field6: "value5",
		...{
			field7: "value7",
		},
		...{
			field8: "value8",
			...{
				field9: "value9",
			}
		},
	}
};

let data5 = [1, 2, 3];
let data6 = [
	0,
	...data5,
	4,
	...[5, 6],
	...[
		...[7, 8],
		9,
		...[
			9,
			...[10, 11],
			12
		]
	]
];

console.log(JSON.stringify(data4));
