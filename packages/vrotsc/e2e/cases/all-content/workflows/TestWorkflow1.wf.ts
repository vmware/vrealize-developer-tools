import { Workflow } from "vrotsc-annotations";

@Workflow({
	name: "Test Workflow 1",
	path: "MyOrg/MyProject"
})
export class TestWorkflow1 {
	test1(foo: string, bar: string): void {
		System.log(`foo=${foo}, bar=${bar}`);
	}
}
