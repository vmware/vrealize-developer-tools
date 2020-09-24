import { Workflow } from "vrotsc-annotations";

@Workflow()
export class TestWorkflow1 {
	test1(foo: string, bar: string): void {
		System.log(`foo=${foo}, bar=${bar}`);
	}
}
