import { Workflow, In, Out } from "vrotsc-annotations";
import TestClass1, { TestClass2 } from "com.vmware.pscoe.tests/action1";
import TestClass3, { TestClass4 } from "com.vmware.pscoe.tests/action2";

@Workflow({
	name: "Test Workflow 4",
	path: "PS CoE/Test Workflows",
	input: {
		param1: {
			type: "string",
			title: "Param 1",
			required: true,
			minStringLength: 5,
			maxStringLength: 50,
		},
		param2: {
			type: "string",
			title: "Param 2",
			required: true,
			defaultValue: "val1",
			availableValues: ["val1", "val2", "val3"],
		},
		param3: {
			type: "number",
			title: "Param 3",
			defaultValue: 3,
			availableValues: [0, 1, 2, 3],
		},
		param4: {
			type: "boolean",
			title: "Param 4",
		},
		param5: {
			type: "Array/number",
			title: "Param 5",
		}
	},
	output: {
		outParam1: {
			type: "string",
			title: "Out Param 1",
		},
		outParam2: {
			type: "number",
			title: "Out Param 2",
		}
	},
	attributes: {
		att1: { type: "string" },
		att2: { type: "Array/number" }
	}
})
export class TestWorkflow4 {
	action1(param1: string, param2: string, @Out att1: string, @Out att2: number[]): void {
		System.log(`[action1] param1='${param1}', param2='${param2}'`);
		new TestClass1();
		new TestClass2();
		att1 = "Att1";
		att2 = [31, 17, 44];
	}

	action2(param3: number, att1: string, att2: number[]): void {
		System.log(`[action2] param3='${param3}', att1='${att1}', att2='${(att2 || []).map(x => x.toString()).join(",")}'`);
	}

	action3(@In @Out att2: number[], @Out outParam1: string): void {
		att2 = (att2 || []).map(x => x << 2);
		outParam1 = "Out Value2";
	}

	action4(param4: boolean, param5: number[], att2: number[], @Out outParam2: number[]): void {
		System.log(`[action4] param4='${param4}', param5='${(param5 || []).map(x => x.toString()).join(",")}', att2='${(att2 || []).map(x => x.toString()).join(",")}'`);
		new TestClass1();
		new TestClass3();
		new TestClass4();
		outParam2 = (att2 || []).map(x => x / 2);
	}
}
