import { Workflow } from "vrotsc-annotations";

@Workflow()
export class TestWorkflow2 {
	add(x: number, y: number): void {
		System.log(`${x}+${y}=${x + y}`);
	}
}
