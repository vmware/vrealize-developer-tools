import { Workflow, Out } from "vrotsc-annotations";

@Workflow()
export class TestWorkflow3 {
	test1(foo: string, bar: string, @Out result: string): void {
		System.log(`foo=${foo}, bar=${bar}`);
		result = "test result";
	}
}
