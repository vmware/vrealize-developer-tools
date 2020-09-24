import { Workflow } from "vrotsc-annotations";

@Workflow({
	name: "Test Workflow 2",
	path: "PS CoE/Test Workflows",
	input: {
		url: {
			type: "string",
			title: "Hostname or IP address",
			required: true,
			minStringLength: 5,
			maxStringLength: 50,
		},
		apiVersion: {
			type: "string",
			title: "API Version (e.g. v32.0)",
			required: true,
			defaultValue: "v32.0",
			availableValues: ["v29.0", "v30.0", "v31.0", "v32.0"],
		},
		retryCount: {
			type: "number",
			title: "Number of retries?",
			defaultValue: 3,
			availableValues: [0, 1, 2, 3],
		}
	}
})
export class TestWorkflow2 {
	test1(url: string, apiVersion: string, retryCount?: number): void {
		System.log(`url=${url}, apiVersion=${apiVersion}, retryCount=${retryCount}`);
	}
}
