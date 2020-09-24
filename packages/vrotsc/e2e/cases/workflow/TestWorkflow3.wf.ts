import { Workflow, In, Out } from "vrotsc-annotations";

@Workflow({
	name: "Test Workflow 3",
	path: "PS CoE/Test Workflows",
})
export class TestWorkflow3 {
	test1(p1: string, @In p2: string, @Out p3: string, @In @Out p4: string): void {
		System.log(`p1=${p1}, p2=${p2}, p3=${p3}, p4=${p4}`);
	}
}
