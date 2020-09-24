import { Workflow } from "vrotsc-annotations";

interface UserLogin {
	id: number, 
	name: string, 
	password: SecureString,
}

@Workflow({
	name: "Test Workflow 2",
	path: "MyOrg/MyProject"
})
export class TestWorkflow1 {
	test1(foo: string, bar: string, logins: UserLogin[]): void {
		System.log(`foo=${foo}, bar=${bar}`);
		System.log(`logins=${JSON.stringify(logins)}`);
	}
}
